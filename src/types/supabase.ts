export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      plants: {
        Row: {
          id: string
          name: string
          scientific_name: string
          image_url: string
          watering_needs: string
          sunlight: string
          temperature: string
          description: string
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          scientific_name: string
          image_url: string
          watering_needs?: string
          sunlight?: string
          temperature?: string
          description?: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          scientific_name?: string
          image_url?: string
          watering_needs?: string
          sunlight?: string
          temperature?: string
          description?: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      plant_care_instructions: {
        Row: {
          id: string
          plant_id: string
          watering: string
          light: string
          soil: string
          humidity: string
          fertilizing: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          plant_id: string
          watering?: string
          light?: string
          soil?: string
          humidity?: string
          fertilizing?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          plant_id?: string
          watering?: string
          light?: string
          soil?: string
          humidity?: string
          fertilizing?: string
          created_at?: string
          updated_at?: string
        }
      }
      plant_facts: {
        Row: {
          id: string
          plant_id: string
          fact: string
          created_at: string
        }
        Insert: {
          id?: string
          plant_id: string
          fact: string
          created_at?: string
        }
        Update: {
          id?: string
          plant_id?: string
          fact?: string
          created_at?: string
        }
      }
      plant_likes: {
        Row: {
          id: string
          plant_id: string
          device_id: string
          created_at: string
        }
        Insert: {
          id?: string
          plant_id: string
          device_id: string
          created_at?: string
        }
        Update: {
          id?: string
          plant_id?: string
          device_id?: string
          created_at?: string
        }
      }
      identification_history: {
        Row: {
          id: string
          image_url: string
          identified_plant_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          image_url: string
          identified_plant_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          identified_plant_id?: string | null
          created_at?: string
        }
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
  }
}
