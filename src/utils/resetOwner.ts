import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export async function resetOwner(userId?: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user if no userId provided
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { success: false, error: 'No authenticated user found' };
      }
      targetUserId = user.id;
    }

    console.log(`Starting reset for user: ${targetUserId}`);

    // 1. Delete documents from storage and database
    const { data: docs, error: docsError } = await supabase
      .from('documents')
      .select('id, type, url')
      .eq('user_id', targetUserId);

    if (docsError) {
      console.error('Error fetching documents:', docsError);
    } else if (docs && docs.length > 0) {
      // Extract storage paths and delete from storage
      const baseUrl = supabase.storage.from('documents').getPublicUrl('').data.publicUrl;
      const storagePaths = docs.map(doc => doc.url.replace(baseUrl, ''));
      
      if (storagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove(storagePaths);
        
        if (storageError) {
          console.error('Error removing documents from storage:', storageError);
        } else {
          console.log(`Removed ${storagePaths.length} documents from storage`);
        }
      }

      // Delete document records
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('user_id', targetUserId);

      if (deleteError) {
        console.error('Error deleting document records:', deleteError);
      } else {
        console.log(`Deleted ${docs.length} document records`);
      }
    }

    // 2. Delete owner_documents from storage and database
    const { data: ownerDocs, error: ownerDocsError } = await supabase
      .from('owner_documents')
      .select('id, file_path')
      .eq('owner_id', targetUserId);

    if (ownerDocsError) {
      console.error('Error fetching owner documents:', ownerDocsError);
    } else if (ownerDocs && ownerDocs.length > 0) {
      // Delete from owner-documents storage bucket
      const ownerStoragePaths = ownerDocs.map(doc => doc.file_path);
      
      if (ownerStoragePaths.length > 0) {
        const { error: ownerStorageError } = await supabase.storage
          .from('owner-documents')
          .remove(ownerStoragePaths);
        
        if (ownerStorageError) {
          console.error('Error removing owner documents from storage:', ownerStorageError);
        } else {
          console.log(`Removed ${ownerStoragePaths.length} owner documents from storage`);
        }
      }

      // Delete owner_documents records
      const { error: deleteOwnerError } = await supabase
        .from('owner_documents')
        .delete()
        .eq('owner_id', targetUserId);

      if (deleteOwnerError) {
        console.error('Error deleting owner document records:', deleteOwnerError);
      } else {
        console.log(`Deleted ${ownerDocs.length} owner document records`);
      }
    }

    // 3. Delete boats
    const { data: boats, error: boatsError } = await supabase
      .from('boats')
      .select('id')
      .eq('owner_id', targetUserId);

    if (boatsError) {
      console.error('Error fetching boats:', boatsError);
    } else if (boats && boats.length > 0) {
      const { error: deleteBoatsError } = await supabase
        .from('boats')
        .delete()
        .eq('owner_id', targetUserId);

      if (deleteBoatsError) {
        console.error('Error deleting boats:', deleteBoatsError);
      } else {
        console.log(`Deleted ${boats.length} boats`);
      }
    }

    // 4. Delete payouts (if any)
    const { error: payoutsError } = await supabase
      .from('payouts')
      .delete()
      .eq('owner_id', targetUserId);

    if (payoutsError) {
      console.error('Error deleting payouts:', payoutsError);
    } else {
      console.log('Deleted payouts');
    }

    console.log(`Successfully reset all data for user: ${targetUserId}`);
    return { success: true };

  } catch (error) {
    console.error('Error during reset:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}