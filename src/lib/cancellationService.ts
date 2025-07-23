import { supabase } from '@/integrations/supabase/client';
import { CancellationRequest, DisputeRequest, Cancellation, Dispute } from '@/types/cancellation';
import { toast } from 'sonner';

export class CancellationService {
  /**
   * Create a new cancellation request
   */
  static async createCancellation(request: CancellationRequest): Promise<Cancellation> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const cancellationData = {
        booking_id: request.booking_id,
        cancelled_by: user.id,
        cancelled_by_role: request.cancelled_by_role,
        cancellation_reason: request.cancellation_reason,
        reason_comments: request.reason_comments,
        refund_eligible: true, // Default to true, can be adjusted based on business logic
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('cancellations')
        .insert(cancellationData)
        .select()
        .single();

      if (error) throw error;

      // TODO: Update booking status to cancelled
      // TODO: Send cancellation email notifications

      toast.success('Booking cancelled successfully');
      return data as Cancellation;
    } catch (error) {
      console.error('Failed to create cancellation:', error);
      toast.error('Failed to cancel booking. Please try again.');
      throw error;
    }
  }

  /**
   * Escalate a cancellation to dispute
   */
  static async escalateDispute(request: DisputeRequest): Promise<Dispute> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const disputeData = {
        cancellation_id: request.cancellation_id,
        booking_id: request.booking_id,
        initiated_by: user.id,
        dispute_reason: request.dispute_reason,
        evidence_urls: request.evidence_urls,
        status: 'open'
      };

      const { data, error } = await supabase
        .from('disputes')
        .insert(disputeData)
        .select()
        .single();

      if (error) throw error;

      // Update cancellation status to disputed
      await supabase
        .from('cancellations')
        .update({ status: 'disputed' })
        .eq('id', request.cancellation_id);

      // TODO: Send dispute escalation email to admin

      toast.success('Dispute submitted for admin review');
      return data as Dispute;
    } catch (error) {
      console.error('Failed to escalate dispute:', error);
      toast.error('Failed to submit dispute. Please try again.');
      throw error;
    }
  }

  /**
   * Get cancellations for a specific booking
   */
  static async getCancellationsForBooking(bookingId: string): Promise<Cancellation[]> {
    try {
      const { data, error } = await supabase
        .from('cancellations')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Cancellation[];
    } catch (error) {
      console.error('Failed to fetch cancellations:', error);
      return [];
    }
  }

  /**
   * Get disputes for a specific cancellation
   */
  static async getDisputesForCancellation(cancellationId: string): Promise<Dispute[]> {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select('*')
        .eq('cancellation_id', cancellationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Dispute[];
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
      return [];
    }
  }

  /**
   * Get user's cancellations
   */
  static async getUserCancellations(): Promise<Cancellation[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('cancellations')
        .select('*')
        .eq('cancelled_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Cancellation[];
    } catch (error) {
      console.error('Failed to fetch user cancellations:', error);
      return [];
    }
  }

  /**
   * Get user's disputes
   */
  static async getUserDisputes(): Promise<Dispute[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('disputes')
        .select('*')
        .eq('initiated_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Dispute[];
    } catch (error) {
      console.error('Failed to fetch user disputes:', error);
      return [];
    }
  }

  /**
   * Admin: Get all disputes
   */
  static async getAllDisputes(): Promise<Dispute[]> {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          *,
          cancellations (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Dispute[];
    } catch (error) {
      console.error('Failed to fetch all disputes:', error);
      return [];
    }
  }

  /**
   * Admin: Update dispute status
   */
  static async updateDisputeStatus(
    disputeId: string, 
    status: Dispute['status'], 
    adminNotes?: string,
    resolutionNotes?: string
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (adminNotes) updateData.admin_notes = adminNotes;
      if (resolutionNotes) updateData.resolution_notes = resolutionNotes;
      if (status === 'resolved') updateData.resolved_at = new Date().toISOString();

      const { error } = await supabase
        .from('disputes')
        .update(updateData)
        .eq('id', disputeId);

      if (error) throw error;

      // TODO: Send status update email notifications

      toast.success('Dispute status updated successfully');
    } catch (error) {
      console.error('Failed to update dispute status:', error);
      toast.error('Failed to update dispute status');
      throw error;
    }
  }

  /**
   * Check if a booking can be cancelled
   */
  static canCancelBooking(booking: any): { canCancel: boolean; reason?: string } {
    const now = new Date();
    const startDate = new Date(booking.startDate);
    
    // Can't cancel past bookings
    if (startDate < now) {
      return { canCancel: false, reason: 'Cannot cancel past bookings' };
    }

    // Can't cancel if already cancelled
    if (booking.status === 'cancelled') {
      return { canCancel: false, reason: 'Booking is already cancelled' };
    }

    // Check cancellation window (e.g., must cancel at least 24 hours before)
    const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilStart < 24) {
      return { canCancel: false, reason: 'Cannot cancel within 24 hours of start time' };
    }

    return { canCancel: true };
  }
}