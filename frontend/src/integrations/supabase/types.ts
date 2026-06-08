export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      animals: {
        Row: {
          age_months: number | null
          ai_breed_confidence: number | null
          bcs_score: number | null
          breed: string | null
          color: string | null
          created_at: string
          estimated_price_pkr: number | null
          front_image_url: string | null
          gender: Database["public"]["Enums"]["animal_gender"]
          id: string
          left_image_url: string | null
          muzzle_hash: string
          muzzle_image_url: string
          name: string | null
          notes: string | null
          owner_id: string
          owner_name: string | null
          right_image_url: string | null
          species: Database["public"]["Enums"]["animal_species"]
          status: Database["public"]["Enums"]["animal_status"]
          tag_id: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          age_months?: number | null
          ai_breed_confidence?: number | null
          bcs_score?: number | null
          breed?: string | null
          color?: string | null
          created_at?: string
          estimated_price_pkr?: number | null
          front_image_url?: string | null
          gender?: Database["public"]["Enums"]["animal_gender"]
          id?: string
          left_image_url?: string | null
          muzzle_hash: string
          muzzle_image_url: string
          name?: string | null
          notes?: string | null
          owner_id: string
          owner_name?: string | null
          right_image_url?: string | null
          species?: Database["public"]["Enums"]["animal_species"]
          status?: Database["public"]["Enums"]["animal_status"]
          tag_id?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          age_months?: number | null
          ai_breed_confidence?: number | null
          bcs_score?: number | null
          breed?: string | null
          color?: string | null
          created_at?: string
          estimated_price_pkr?: number | null
          front_image_url?: string | null
          gender?: Database["public"]["Enums"]["animal_gender"]
          id?: string
          left_image_url?: string | null
          muzzle_hash?: string
          muzzle_image_url?: string
          name?: string | null
          notes?: string | null
          owner_id?: string
          owner_name?: string | null
          right_image_url?: string | null
          species?: Database["public"]["Enums"]["animal_species"]
          status?: Database["public"]["Enums"]["animal_status"]
          tag_id?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      ownership_transfers: {
        Row: {
          animal_id: string
          created_at: string
          from_user: string
          id: string
          note: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["transfer_status"]
          to_user: string
        }
        Insert: {
          animal_id: string
          created_at?: string
          from_user: string
          id?: string
          note?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["transfer_status"]
          to_user: string
        }
        Update: {
          animal_id?: string
          created_at?: string
          from_user?: string
          id?: string
          note?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["transfer_status"]
          to_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "ownership_transfers_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      animal_gender: "male" | "female" | "unknown"
      animal_species: "cow" | "buffalo"
      animal_status: "active" | "theft" | "sold" | "dead"
      transfer_status: "pending" | "accepted" | "rejected" | "cancelled"
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
      animal_gender: ["male", "female", "unknown"],
      animal_species: ["cow", "buffalo"],
      animal_status: ["active", "theft", "sold", "dead"],
      transfer_status: ["pending", "accepted", "rejected", "cancelled"],
    },
  },
} as const
