export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      banking_details: {
        Row: {
          account_number: string
          account_type: string
          bank_name: string
          branch_code: string
          business_name: string | null
          created_at: string | null
          full_name: string
          id: string
          swift_code: string | null
          updated_at: string | null
          user_id: string
          vat_number: string | null
          verification_notes: string | null
          verification_status: string
        }
        Insert: {
          account_number: string
          account_type: string
          bank_name: string
          branch_code: string
          business_name?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          swift_code?: string | null
          updated_at?: string | null
          user_id: string
          vat_number?: string | null
          verification_notes?: string | null
          verification_status?: string
        }
        Update: {
          account_number?: string
          account_type?: string
          bank_name?: string
          branch_code?: string
          business_name?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          swift_code?: string | null
          updated_at?: string | null
          user_id?: string
          vat_number?: string | null
          verification_notes?: string | null
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "banking_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          body: string
          category: string | null
          created_at: string
          id: string
          published: boolean
          seo_meta: Json | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          category?: string | null
          created_at?: string
          id?: string
          published?: boolean
          seo_meta?: Json | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          category?: string | null
          created_at?: string
          id?: string
          published?: boolean
          seo_meta?: Json | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      boats: {
        Row: {
          created_at: string
          description: string | null
          documents_uploaded: boolean
          id: string
          images: Json | null
          latitude: number | null
          location: string
          longitude: number | null
          owner_id: string
          price_per_day: number
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          type: Database["public"]["Enums"]["boat_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          documents_uploaded?: boolean
          id?: string
          images?: Json | null
          latitude?: number | null
          location: string
          longitude?: number | null
          owner_id: string
          price_per_day: number
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          type: Database["public"]["Enums"]["boat_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          documents_uploaded?: boolean
          id?: string
          images?: Json | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          owner_id?: string
          price_per_day?: number
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          type?: Database["public"]["Enums"]["boat_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "boats_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          boat_id: string
          created_at: string
          end_date: string
          id: string
          renter_id: string
          start_date: string
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
          updated_at: string
        }
        Insert: {
          boat_id: string
          created_at?: string
          end_date: string
          id?: string
          renter_id: string
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price: number
          updated_at?: string
        }
        Update: {
          boat_id?: string
          created_at?: string
          end_date?: string
          id?: string
          renter_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_boat_id_fkey"
            columns: ["boat_id"]
            isOneToOne: false
            referencedRelation: "boats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_renter_id_fkey"
            columns: ["renter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cancellations: {
        Row: {
          booking_id: string
          cancellation_reason: string
          cancelled_by: string
          cancelled_by_role: string
          created_at: string
          id: string
          reason_comments: string | null
          refund_eligible: boolean | null
          status: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          cancellation_reason: string
          cancelled_by: string
          cancelled_by_role: string
          created_at?: string
          id?: string
          reason_comments?: string | null
          refund_eligible?: boolean | null
          status?: string
          updated_at?: string
        }
        Update: {
          booking_id?: string
          cancellation_reason?: string
          cancelled_by?: string
          cancelled_by_role?: string
          created_at?: string
          id?: string
          reason_comments?: string | null
          refund_eligible?: boolean | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          available_dates: Json | null
          created_at: string
          description: string | null
          id: string
          location: string
          price: number
          provider_id: string
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at: string
        }
        Insert: {
          available_dates?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          location: string
          price: number
          provider_id: string
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at?: string
        }
        Update: {
          available_dates?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string
          price?: number
          provider_id?: string
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          admin_notes: string | null
          booking_id: string
          cancellation_id: string
          created_at: string
          dispute_reason: string
          evidence_urls: string[] | null
          id: string
          initiated_by: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          booking_id: string
          cancellation_id: string
          created_at?: string
          dispute_reason: string
          evidence_urls?: string[] | null
          id?: string
          initiated_by: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          booking_id?: string
          cancellation_id?: string
          created_at?: string
          dispute_reason?: string
          evidence_urls?: string[] | null
          id?: string
          initiated_by?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_cancellation_id_fkey"
            columns: ["cancellation_id"]
            isOneToOne: false
            referencedRelation: "cancellations"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          id: string
          type: Database["public"]["Enums"]["document_type"]
          uploaded_at: string
          url: string
          user_id: string
          verified: boolean
        }
        Insert: {
          id?: string
          type: Database["public"]["Enums"]["document_type"]
          uploaded_at?: string
          url: string
          user_id: string
          verified?: boolean
        }
        Update: {
          id?: string
          type?: Database["public"]["Enums"]["document_type"]
          uploaded_at?: string
          url?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          email_address: string
          id: string
          sent_at: string
          status: string | null
          template_type: string
          user_id: string | null
        }
        Insert: {
          email_address: string
          id?: string
          sent_at?: string
          status?: string | null
          template_type: string
          user_id?: string | null
        }
        Update: {
          email_address?: string
          id?: string
          sent_at?: string
          status?: string | null
          template_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          message: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          message: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          message?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number
          booking_id: string
          id: string
          owner_id: string
          paid_at: string | null
          requested_at: string
          status: Database["public"]["Enums"]["payout_status"]
        }
        Insert: {
          amount: number
          booking_id: string
          id?: string
          owner_id: string
          paid_at?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["payout_status"]
        }
        Update: {
          amount?: number
          booking_id?: string
          id?: string
          owner_id?: string
          paid_at?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["payout_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payouts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_id: string
          booking_id: string
          created_at: string
          id: string
          moderated_at: string | null
          moderated_by: string | null
          owner_reply: string | null
          owner_reply_at: string | null
          rating: number
          recipient_id: string
          review_text: string | null
          status: string | null
        }
        Insert: {
          author_id: string
          booking_id: string
          created_at?: string
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          owner_reply?: string | null
          owner_reply_at?: string | null
          rating: number
          recipient_id: string
          review_text?: string | null
          status?: string | null
        }
        Update: {
          author_id?: string
          booking_id?: string
          created_at?: string
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          owner_reply?: string | null
          owner_reply_at?: string | null
          rating?: number
          recipient_id?: string
          review_text?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          profile_image_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      boat_type: "sailing" | "motorboat" | "jetski" | "pontoon" | "other"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      document_type:
        | "license"
        | "insurance"
        | "registration"
        | "safety_certificate"
        | "identity"
      listing_status: "pending" | "active" | "suspended"
      payout_status: "pending" | "paid" | "failed"
      user_role: "renter" | "owner" | "provider" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      boat_type: ["sailing", "motorboat", "jetski", "pontoon", "other"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      document_type: [
        "license",
        "insurance",
        "registration",
        "safety_certificate",
        "identity",
      ],
      listing_status: ["pending", "active", "suspended"],
      payout_status: ["pending", "paid", "failed"],
      user_role: ["renter", "owner", "provider", "admin"],
    },
  },
} as const
