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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_corrections: {
        Row: {
          ai_feedback: string | null
          created_at: string
          expected_text: string | null
          id: string
          input_type: string
          lesson_id: string | null
          score: number | null
          user_id: string
          user_input: string
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string
          expected_text?: string | null
          id?: string
          input_type: string
          lesson_id?: string | null
          score?: number | null
          user_id: string
          user_input: string
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string
          expected_text?: string | null
          id?: string
          input_type?: string
          lesson_id?: string | null
          score?: number | null
          user_id?: string
          user_input?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_corrections_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_translations: {
        Row: {
          content: string | null
          id: string
          language: Database["public"]["Enums"]["ui_language"]
          lesson_id: string
          title: string
        }
        Insert: {
          content?: string | null
          id?: string
          language: Database["public"]["Enums"]["ui_language"]
          lesson_id: string
          title: string
        }
        Update: {
          content?: string | null
          id?: string
          language?: Database["public"]["Enums"]["ui_language"]
          lesson_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_translations_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          order_index: number
          scenario_id: string
          xp_reward: number | null
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          order_index?: number
          scenario_id: string
          xp_reward?: number | null
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          order_index?: number
          scenario_id?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_level: Database["public"]["Enums"]["german_level"] | null
          display_name: string | null
          id: string
          preferred_language: Database["public"]["Enums"]["ui_language"] | null
          streak_days: number | null
          total_xp: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_level?: Database["public"]["Enums"]["german_level"] | null
          display_name?: string | null
          id?: string
          preferred_language?: Database["public"]["Enums"]["ui_language"] | null
          streak_days?: number | null
          total_xp?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_level?: Database["public"]["Enums"]["german_level"] | null
          display_name?: string | null
          id?: string
          preferred_language?: Database["public"]["Enums"]["ui_language"] | null
          streak_days?: number | null
          total_xp?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scenario_translations: {
        Row: {
          description: string | null
          id: string
          language: Database["public"]["Enums"]["ui_language"]
          name: string
          scenario_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          language: Database["public"]["Enums"]["ui_language"]
          name: string
          scenario_id: string
        }
        Update: {
          description?: string | null
          id?: string
          language?: Database["public"]["Enums"]["ui_language"]
          name?: string
          scenario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenario_translations_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scenarios: {
        Row: {
          created_at: string
          icon: string
          id: string
          is_free: boolean | null
          level: Database["public"]["Enums"]["german_level"]
          order_index: number
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          is_free?: boolean | null
          level: Database["public"]["Enums"]["german_level"]
          order_index?: number
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          is_free?: boolean | null
          level?: Database["public"]["Enums"]["german_level"]
          order_index?: number
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vocabulary: {
        Row: {
          article: string | null
          german_word: string
          id: string
          image_url: string | null
          lesson_id: string
          order_index: number | null
          plural: string | null
          pronunciation_url: string | null
        }
        Insert: {
          article?: string | null
          german_word: string
          id?: string
          image_url?: string | null
          lesson_id: string
          order_index?: number | null
          plural?: string | null
          pronunciation_url?: string | null
        }
        Update: {
          article?: string | null
          german_word?: string
          id?: string
          image_url?: string | null
          lesson_id?: string
          order_index?: number | null
          plural?: string | null
          pronunciation_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary_translations: {
        Row: {
          example_sentence: string | null
          id: string
          language: Database["public"]["Enums"]["ui_language"]
          translation: string
          vocabulary_id: string
        }
        Insert: {
          example_sentence?: string | null
          id?: string
          language: Database["public"]["Enums"]["ui_language"]
          translation: string
          vocabulary_id: string
        }
        Update: {
          example_sentence?: string | null
          id?: string
          language?: Database["public"]["Enums"]["ui_language"]
          translation?: string
          vocabulary_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_translations_vocabulary_id_fkey"
            columns: ["vocabulary_id"]
            isOneToOne: false
            referencedRelation: "vocabulary"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "premium"
      german_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
      ui_language: "en" | "ar" | "tr" | "uk"
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
      app_role: ["admin", "user", "premium"],
      german_level: ["A1", "A2", "B1", "B2", "C1", "C2"],
      ui_language: ["en", "ar", "tr", "uk"],
    },
  },
} as const
