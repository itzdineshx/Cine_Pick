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
      bookings: {
        Row: {
          created_at: string | null
          event_date: string | null
          event_id: string
          event_time: string | null
          event_title: string | null
          id: string
          location: string | null
          payload: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_date?: string | null
          event_id: string
          event_time?: string | null
          event_title?: string | null
          id?: string
          location?: string | null
          payload: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_date?: string | null
          event_id?: string
          event_time?: string | null
          event_title?: string | null
          id?: string
          location?: string | null
          payload?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      elasticity: {
        Row: {
          key: string
          value: number | null
        }
        Insert: {
          key: string
          value?: number | null
        }
        Update: {
          key?: string
          value?: number | null
        }
        Relationships: []
      }
      forecasts: {
        Row: {
          created_at: string | null
          demand: number | null
          event_id: string | null
          for_date: string
          revenue: number | null
        }
        Insert: {
          created_at?: string | null
          demand?: number | null
          event_id?: string | null
          for_date: string
          revenue?: number | null
        }
        Update: {
          created_at?: string | null
          demand?: number | null
          event_id?: string | null
          for_date?: string
          revenue?: number | null
        }
        Relationships: []
      }
      historical_demand: {
        Row: {
          created_at: string | null
          event_id: string
          for_date: string
          id: number
          price: number | null
          sold: number | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          for_date: string
          id?: never
          price?: number | null
          sold?: number | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          for_date?: string
          id?: never
          price?: number | null
          sold?: number | null
        }
        Relationships: []
      }
      price_tests: {
        Row: {
          base_price: number | null
          created_at: string | null
          demand_at_base: number | null
          elasticity: number | null
          id: number
          predicted_demand: number | null
          predicted_revenue: number | null
          proposed_price: number | null
        }
        Insert: {
          base_price?: number | null
          created_at?: string | null
          demand_at_base?: number | null
          elasticity?: number | null
          id?: never
          predicted_demand?: number | null
          predicted_revenue?: number | null
          proposed_price?: number | null
        }
        Update: {
          base_price?: number | null
          created_at?: string | null
          demand_at_base?: number | null
          elasticity?: number | null
          id?: never
          predicted_demand?: number | null
          predicted_revenue?: number | null
          proposed_price?: number | null
        }
        Relationships: []
      }
      segments: {
        Row: {
          avg_price: number | null
          name: string
          share: number | null
        }
        Insert: {
          avg_price?: number | null
          name: string
          share?: number | null
        }
        Update: {
          avg_price?: number | null
          name?: string
          share?: number | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
