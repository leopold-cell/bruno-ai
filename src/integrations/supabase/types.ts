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
      blog_posts: {
        Row: {
          body: Json
          category: string
          created_at: string
          description: string
          excerpt: string
          id: string
          keyword: string | null
          published_at: string | null
          reading_minutes: number
          slug: string
          source: string | null
          status: string
          title: string
          tldr: Json
          updated_at: string
        }
        Insert: {
          body?: Json
          category: string
          created_at?: string
          description: string
          excerpt: string
          id?: string
          keyword?: string | null
          published_at?: string | null
          reading_minutes?: number
          slug: string
          source?: string | null
          status?: string
          title: string
          tldr?: Json
          updated_at?: string
        }
        Update: {
          body?: Json
          category?: string
          created_at?: string
          description?: string
          excerpt?: string
          id?: string
          keyword?: string | null
          published_at?: string | null
          reading_minutes?: number
          slug?: string
          source?: string | null
          status?: string
          title?: string
          tldr?: Json
          updated_at?: string
        }
        Relationships: []
      }
      checkins: {
        Row: {
          anxiety: number | null
          created_at: string
          energy: number | null
          id: string
          mood: number | null
          note: string | null
          sleep: number | null
          user_id: string
        }
        Insert: {
          anxiety?: number | null
          created_at?: string
          energy?: number | null
          id?: string
          mood?: number | null
          note?: string | null
          sleep?: number | null
          user_id: string
        }
        Update: {
          anxiety?: number | null
          created_at?: string
          energy?: number | null
          id?: string
          mood?: number | null
          note?: string | null
          sleep?: number | null
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          body: string
          created_at: string
          id: string
          tags: string[]
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          tags?: string[]
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          tags?: string[]
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      memories: {
        Row: {
          content: string
          created_at: string
          embedding: string | null
          id: string
          kind: string
          last_used_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          kind: string
          last_used_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          kind?: string
          last_used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          client_msg_id: string | null
          conversation_id: string
          created_at: string
          id: string
          parts: Json
          role: string
          user_id: string
        }
        Insert: {
          client_msg_id?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          parts: Json
          role: string
          user_id: string
        }
        Update: {
          client_msg_id?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          parts?: Json
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          crisis_region: string
          display_name: string | null
          id: string
          locale: string
          onboarding_done: boolean
          push_enabled: boolean
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          crisis_region?: string
          display_name?: string | null
          id: string
          locale?: string
          onboarding_done?: boolean
          push_enabled?: boolean
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          crisis_region?: string
          display_name?: string | null
          id?: string
          locale?: string
          onboarding_done?: boolean
          push_enabled?: boolean
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      routine_runs: {
        Row: {
          completed: boolean
          id: string
          ran_at: string
          routine_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          id?: string
          ran_at?: string
          routine_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          id?: string
          ran_at?: string
          routine_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_runs_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          created_at: string
          days_of_week: number[]
          enabled: boolean
          id: string
          kind: string
          last_sent_at: string | null
          name: string
          time_of_day: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[]
          enabled?: boolean
          id?: string
          kind: string
          last_sent_at?: string | null
          name: string
          time_of_day: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[]
          enabled?: boolean
          id?: string
          kind?: string
          last_sent_at?: string | null
          name?: string
          time_of_day?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      safety_events: {
        Row: {
          created_at: string
          hotline_shown: boolean
          id: string
          message_id: string | null
          region: string | null
          severity: string
          themes: string[]
          user_id: string
        }
        Insert: {
          created_at?: string
          hotline_shown?: boolean
          id?: string
          message_id?: string | null
          region?: string | null
          severity: string
          themes?: string[]
          user_id: string
        }
        Update: {
          created_at?: string
          hotline_shown?: boolean
          id?: string
          message_id?: string | null
          region?: string | null
          severity?: string
          themes?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_events_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      thought_records: {
        Row: {
          automatic_thought: string
          created_at: string
          distortions: string[]
          emotion: string | null
          emotion_intensity: number | null
          id: string
          outcome: string | null
          reframe: string | null
          situation: string
          user_id: string
        }
        Insert: {
          automatic_thought: string
          created_at?: string
          distortions?: string[]
          emotion?: string | null
          emotion_intensity?: number | null
          id?: string
          outcome?: string | null
          reframe?: string | null
          situation: string
          user_id: string
        }
        Update: {
          automatic_thought?: string
          created_at?: string
          distortions?: string[]
          emotion?: string | null
          emotion_intensity?: number | null
          id?: string
          outcome?: string | null
          reframe?: string | null
          situation?: string
          user_id?: string
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          activated_at: string | null
          check_answers: Json | null
          check_score: number | null
          created_at: string
          email: string
          id: string
          name: string
          source: string | null
        }
        Insert: {
          activated_at?: string | null
          check_answers?: Json | null
          check_score?: number | null
          created_at?: string
          email: string
          id?: string
          name: string
          source?: string | null
        }
        Update: {
          activated_at?: string | null
          check_answers?: Json | null
          check_score?: number | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_memories: {
        Args: { p_limit?: number; p_query: string }
        Returns: {
          content: string
          id: string
          kind: string
          similarity: number
        }[]
      }
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
