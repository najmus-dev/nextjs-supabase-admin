export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business_business_disciplines: {
        Row: {
          created_at: string | null
          discipline_id: string
          id: string
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          discipline_id: string
          id?: string
          profile_id: string
        }
        Update: {
          created_at?: string | null
          discipline_id?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_business_disciplines_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_business_disciplines_profile_id_fkey1"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_business_specialties: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string
          specialty_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: string
          specialty_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string
          specialty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_business_specialties_profile_id_fkey1"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_business_specialties_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      business_business_sub_categories: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string
          sub_category_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: string
          sub_category_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string
          sub_category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_business_sub_categories_profile_id_fkey1"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_business_sub_categories_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "business_sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      business_categories: {
        Row: {
          created_at: string
          id: string
          is_featured: boolean
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_featured?: boolean
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_featured?: boolean
          name?: string | null
        }
        Relationships: []
      }
      business_sub_categories: {
        Row: {
          category_id: string | null
          created_at: string
          has_discipline: boolean | null
          id: string
          name: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          has_discipline?: boolean | null
          id?: string
          name?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          has_discipline?: boolean | null
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_sub_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string
          bio: string
          category_id: string | null
          country: string
          created_at: string | null
          email: string
          id: string
          image_url: string | null
          is_hiring: boolean
          is_premium: boolean
          is_registered: boolean | null
          name: string
          owner_name: string
          phone_number: string
          proof_url: string | null
          socials: Json | null
          status: string | null
          user_id: string
          years_in_business: number
        }
        Insert: {
          address: string
          bio: string
          category_id?: string | null
          country: string
          created_at?: string | null
          email: string
          id?: string
          image_url?: string | null
          is_hiring?: boolean
          is_premium?: boolean
          is_registered?: boolean | null
          name: string
          owner_name: string
          phone_number: string
          proof_url?: string | null
          socials?: Json | null
          status?: string | null
          user_id: string
          years_in_business: number
        }
        Update: {
          address?: string
          bio?: string
          category_id?: string | null
          country?: string
          created_at?: string | null
          email?: string
          id?: string
          image_url?: string | null
          is_hiring?: boolean
          is_premium?: boolean
          is_registered?: boolean | null
          name?: string
          owner_name?: string
          phone_number?: string
          proof_url?: string | null
          socials?: Json | null
          status?: string | null
          user_id?: string
          years_in_business?: number
        }
        Relationships: [
          {
            foreignKeyName: "businesses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      disciplines: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      event_bookings: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_bookings_profile_id_fkey1"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_categories: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          address: string
          business_id: string
          category_id: string
          country: string
          created_at: string | null
          description: string
          has_ticket: boolean | null
          id: string
          image_url: string
          start_at: string
          title: string
        }
        Insert: {
          address: string
          business_id: string
          category_id: string
          country: string
          created_at?: string | null
          description: string
          has_ticket?: boolean | null
          id?: string
          image_url: string
          start_at: string
          title: string
        }
        Update: {
          address?: string
          business_id?: string
          category_id?: string
          country?: string
          created_at?: string | null
          description?: string
          has_ticket?: boolean | null
          id?: string
          image_url?: string
          start_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string | null
          rating: number
          review: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id?: string | null
          rating: number
          review: string
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string | null
          rating?: number
          review?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          address: string
          business_id: string
          category_id: string
          country: string
          created_at: string | null
          description: string
          id: string
          image_url: string
          title: string
        }
        Insert: {
          address: string
          business_id: string
          category_id: string
          country: string
          created_at?: string | null
          description: string
          id?: string
          image_url: string
          title: string
        }
        Update: {
          address?: string
          business_id?: string
          category_id?: string
          country?: string
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "opportunity_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_categories: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      opportunity_likes: {
        Row: {
          created_at: string | null
          id: string
          opportunity_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunity_id: string
          profile_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunity_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_likes_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_saves: {
        Row: {
          created_at: string | null
          id: string
          opportunity_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunity_id: string
          profile_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunity_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_saves_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_saves_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_shares: {
        Row: {
          created_at: string | null
          id: string
          opportunity_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunity_id: string
          profile_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunity_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_shares_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_shares_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_categories: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_saves: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_saves_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_saves_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_shares: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_shares_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          business_id: string
          category_id: string
          created_at: string | null
          description: string
          id: string
          image_url: string
          is_verified: boolean | null
          title: string
          video_url: string | null
        }
        Insert: {
          business_id: string
          category_id: string
          created_at?: string | null
          description: string
          id?: string
          image_url: string
          is_verified?: boolean | null
          title: string
          video_url?: string | null
        }
        Update: {
          business_id?: string
          category_id?: string
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string
          is_verified?: boolean | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "post_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          country: string | null
          created_at: string | null
          email: string
          id: string
          image_url: string | null
          location: unknown | null
          name: string | null
        }
        Insert: {
          address?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          id: string
          image_url?: string | null
          location?: unknown | null
          name?: string | null
        }
        Update: {
          address?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          id?: string
          image_url?: string | null
          location?: unknown | null
          name?: string | null
        }
        Relationships: []
      }
      service_bookings: {
        Row: {
          booking_date: string | null
          created_at: string | null
          id: string
          profile_id: string | null
          service_id: string | null
        }
        Insert: {
          booking_date?: string | null
          created_at?: string | null
          id?: string
          profile_id?: string | null
          service_id?: string | null
        }
        Update: {
          booking_date?: string | null
          created_at?: string | null
          id?: string
          profile_id?: string | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_profile_id_fkey1"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_disciplines: {
        Row: {
          created_at: string | null
          discipline_id: string
          id: string
          service_id: string
        }
        Insert: {
          created_at?: string | null
          discipline_id?: string
          id?: string
          service_id?: string
        }
        Update: {
          created_at?: string | null
          discipline_id?: string
          id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_disciplines_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_disciplines_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_reviews: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          rating: number
          review: string
          service_id: string
          user_id: string
        }
        Insert: {
          booking_id?: string
          created_at?: string
          id?: string
          rating?: number
          review: string
          service_id?: string
          user_id?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          rating?: number
          review?: string
          service_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "service_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      service_specialties: {
        Row: {
          created_at: string | null
          id: string
          service_id: string
          specialty_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          service_id?: string
          specialty_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          service_id?: string
          specialty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_specialties_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_specialties_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          address: string
          business_id: string
          category_id: string
          country: string
          created_at: string | null
          description: string
          fixed_price: number | null
          id: string
          image_url: string
          max_price_range: number | null
          min_price_range: number | null
          price_duration: string | null
          price_type: string
          sub_category_id: string
          title: string
        }
        Insert: {
          address: string
          business_id: string
          category_id: string
          country: string
          created_at?: string | null
          description: string
          fixed_price?: number | null
          id?: string
          image_url: string
          max_price_range?: number | null
          min_price_range?: number | null
          price_duration?: string | null
          price_type: string
          sub_category_id: string
          title: string
        }
        Update: {
          address?: string
          business_id?: string
          category_id?: string
          country?: string
          created_at?: string | null
          description?: string
          fixed_price?: number | null
          id?: string
          image_url?: string
          max_price_range?: number | null
          min_price_range?: number | null
          price_duration?: string | null
          price_type?: string
          sub_category_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey1"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "business_sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      specialties: {
        Row: {
          created_at: string
          has_discipline: boolean
          id: string
          name: string | null
          sub_category_id: string | null
        }
        Insert: {
          created_at?: string
          has_discipline?: boolean
          id?: string
          name?: string | null
          sub_category_id?: string | null
        }
        Update: {
          created_at?: string
          has_discipline?: boolean
          id?: string
          name?: string | null
          sub_category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "specialties_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "business_sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          business_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscribers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
