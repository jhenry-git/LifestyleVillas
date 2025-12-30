import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types will be generated after schema is created
export type Database = {
  public: {
    Tables: {
      villas: {
        Row: {
          id: string
          house_number: string
          name: string
          description: string | null
          base_price: number
          capacity: number
          amenities: any[]
          images: any[]
          status: 'active' | 'hidden' | 'maintenance'
          featured: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          house_number: string
          name: string
          description?: string | null
          base_price: number
          capacity: number
          amenities?: any[]
          images?: any[]
          status?: 'active' | 'hidden' | 'maintenance'
          featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          house_number?: string
          name?: string
          description?: string | null
          base_price?: number
          capacity?: number
          amenities?: any[]
          images?: any[]
          status?: 'active' | 'hidden' | 'maintenance'
          featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          name: string
          description: string | null
          discount_type: 'percentage' | 'fixed' | 'nights_based'
          discount_value: number | null
          valid_from: string | null
          valid_to: string | null
          tag: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          discount_type: 'percentage' | 'fixed' | 'nights_based'
          discount_value?: number | null
          valid_from?: string | null
          valid_to?: string | null
          tag?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed' | 'nights_based'
          discount_value?: number | null
          valid_from?: string | null
          valid_to?: string | null
          tag?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      booking_requests: {
        Row: {
          id: string
          reference_id: string
          villa_id: string | null
          check_in: string
          check_out: string
          guests: number
          nights: number
          total_price: number
          applied_offer_id: string | null
          guest_name: string | null
          guest_email: string | null
          guest_phone: string | null
          status: 'pending' | 'confirmed' | 'cancelled'
          created_at: string
        }
      }
      reviews: {
        Row: {
          id: string
          source: string
          reviewer_name: string
          rating: number
          review_text: string | null
          verified: boolean
          created_at: string
          synced_at: string
        }
      }
    }
  }
}
