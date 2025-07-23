export interface Cancellation {
  id: string;
  booking_id: string;
  cancelled_by: string;
  cancelled_by_role: 'renter' | 'owner';
  cancellation_reason: 'weather-related' | 'mechanical-issues' | 'customer-changed-plans' | 'owner-unavailable' | 'other';
  reason_comments?: string;
  refund_eligible: boolean;
  status: 'pending' | 'processed' | 'disputed';
  created_at: string;
  updated_at: string;
}

export interface Dispute {
  id: string;
  cancellation_id: string;
  booking_id: string;
  initiated_by: string;
  dispute_reason: string;
  evidence_urls?: string[];
  admin_notes?: string;
  resolution_notes?: string;
  status: 'open' | 'investigating' | 'resolved';
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CancellationRequest {
  booking_id: string;
  cancellation_reason: Cancellation['cancellation_reason'];
  reason_comments?: string;
  cancelled_by_role: 'renter' | 'owner';
}

export interface DisputeRequest {
  cancellation_id: string;
  booking_id: string;
  dispute_reason: string;
  evidence_urls?: string[];
}