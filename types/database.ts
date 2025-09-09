export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'manager' | 'receptionist' | 'kitchen_staff' | 'bar_staff' | 'housekeeping' | 'maintenance' | 'accountant' | 'store_keeper';
          phone?: string;
          avatar_url?: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'manager' | 'receptionist' | 'kitchen_staff' | 'bar_staff' | 'housekeeping' | 'maintenance' | 'accountant' | 'store_keeper';
          phone?: string;
          avatar_url?: string;
          is_active?: boolean;
        };
        Update: {
          full_name?: string;
          role?: 'admin' | 'manager' | 'receptionist' | 'kitchen_staff' | 'bar_staff' | 'housekeeping' | 'maintenance' | 'accountant' | 'store_keeper';
          phone?: string;
          avatar_url?: string;
          is_active?: boolean;
        };
      };
      rooms: {
        Row: {
          id: string;
          room_number: string;
          room_type: 'standard' | 'deluxe' | 'suite' | 'presidential' | 'family' | 'executive';
          status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'reserved' | 'out_of_order';
          price_per_night: number;
          amenities: string[];
          floor: number;
          max_occupancy: number;
          description?: string;
          images?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          room_number: string;
          room_type: 'standard' | 'deluxe' | 'suite' | 'presidential' | 'family' | 'executive';
          status?: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'reserved' | 'out_of_order';
          price_per_night: number;
          amenities?: string[];
          floor: number;
          max_occupancy: number;
          description?: string;
          images?: string[];
        };
        Update: {
          status?: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'reserved' | 'out_of_order';
          price_per_night?: number;
          amenities?: string[];
          description?: string;
          images?: string[];
        };
      };
      bookings: {
        Row: {
          id: string;
          guest_name: string;
          guest_email: string;
          guest_phone: string;
          guest_id_number?: string;
          room_id: string;
          check_in: string;
          check_out: string;
          checkout_time: string; // 12:00 PM checkout time
          total_amount: number;
          deposit_amount: number;
          payment_status: 'pending' | 'partial' | 'paid' | 'refunded' | 'overdue';
          booking_status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
          special_requests?: string;
          adults: number;
          children: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          guest_name: string;
          guest_email: string;
          guest_phone: string;
          guest_id_number?: string;
          room_id: string;
          check_in: string;
          check_out: string;
          checkout_time?: string;
          total_amount: number;
          deposit_amount?: number;
          payment_status?: 'pending' | 'partial' | 'paid' | 'refunded' | 'overdue';
          booking_status?: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
          special_requests?: string;
          adults: number;
          children: number;
        };
        Update: {
          booking_status?: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
          payment_status?: 'pending' | 'partial' | 'paid' | 'refunded' | 'overdue';
          total_amount?: number;
          deposit_amount?: number;
        };
      };
      halls: {
        Row: {
          id: string;
          hall_name: string;
          hall_type: 'conference' | 'banquet' | 'wedding' | 'meeting' | 'exhibition' | 'ballroom';
          capacity: number;
          hourly_rate: number;
          daily_rate: number;
          amenities: string[];
          description?: string;
          images?: string[];
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          hall_name: string;
          hall_type: 'conference' | 'banquet' | 'wedding' | 'meeting' | 'exhibition' | 'ballroom';
          capacity: number;
          hourly_rate: number;
          daily_rate: number;
          amenities?: string[];
          description?: string;
          images?: string[];
          is_available?: boolean;
        };
        Update: {
          hourly_rate?: number;
          daily_rate?: number;
          amenities?: string[];
          description?: string;
          images?: string[];
          is_available?: boolean;
        };
      };
      hall_bookings: {
        Row: {
          id: string;
          hall_id: string;
          client_name: string;
          client_email: string;
          client_phone: string;
          event_type: string;
          start_datetime: string;
          end_datetime: string;
          total_amount: number;
          deposit_amount: number;
          payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
          booking_status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          special_requirements?: string;
          guest_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          hall_id: string;
          client_name: string;
          client_email: string;
          client_phone: string;
          event_type: string;
          start_datetime: string;
          end_datetime: string;
          total_amount: number;
          deposit_amount?: number;
          payment_status?: 'pending' | 'partial' | 'paid' | 'refunded';
          booking_status?: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          special_requirements?: string;
          guest_count: number;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: 'appetizer' | 'main_course' | 'dessert' | 'beverage' | 'wine' | 'beer' | 'cocktail' | 'spirits' | 'coffee' | 'tea' | 'juice' | 'water';
          subcategory?: string;
          price: number;
          cost_price: number;
          ingredients: string[];
          allergens?: string[];
          recipe_id?: string;
          prep_time_minutes?: number;
          cooking_time_minutes?: number;
          difficulty_level?: 'easy' | 'medium' | 'hard';
          is_available: boolean;
          is_vegetarian: boolean;
          is_vegan: boolean;
          is_gluten_free: boolean;
          calories?: number;
          image_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          category: 'appetizer' | 'main_course' | 'dessert' | 'beverage' | 'wine' | 'beer' | 'cocktail' | 'spirits' | 'coffee' | 'tea' | 'juice' | 'water';
          subcategory?: string;
          price: number;
          cost_price: number;
          ingredients: string[];
          allergens?: string[];
          recipe_id?: string;
          prep_time_minutes?: number;
          cooking_time_minutes?: number;
          difficulty_level?: 'easy' | 'medium' | 'hard';
          is_available?: boolean;
          is_vegetarian?: boolean;
          is_vegan?: boolean;
          is_gluten_free?: boolean;
          calories?: number;
          image_url?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          name: string;
          description: string;
          instructions: string;
          prep_time_minutes: number;
          cooking_time_minutes: number;
          servings: number;
          difficulty_level: 'easy' | 'medium' | 'hard';
          ingredients: Array<{
            name: string;
            quantity: number;
            unit: string;
            notes?: string;
          }>;
          nutritional_info?: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
          };
          chef_notes?: string;
          image_url?: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          instructions: string;
          prep_time_minutes: number;
          cooking_time_minutes: number;
          servings: number;
          difficulty_level: 'easy' | 'medium' | 'hard';
          ingredients: Array<{
            name: string;
            quantity: number;
            unit: string;
            notes?: string;
          }>;
          nutritional_info?: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
          };
          chef_notes?: string;
          image_url?: string;
          created_by: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          booking_id?: string;
          hall_booking_id?: string;
          table_number?: string;
          order_type: 'room_service' | 'restaurant' | 'bar' | 'pool_bar' | 'hall_service';
          items: Array<{
            menu_item_id: string;
            quantity: number;
            unit_price: number;
            special_instructions?: string;
          }>;
          subtotal: number;
          tax_amount: number;
          service_charge: number;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
          payment_status: 'pending' | 'paid' | 'refunded';
          payment_method?: 'cash' | 'card' | 'room_charge' | 'mobile_money';
          special_instructions?: string;
          estimated_time?: number;
          served_by?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          order_number: string;
          booking_id?: string;
          hall_booking_id?: string;
          table_number?: string;
          order_type: 'room_service' | 'restaurant' | 'bar' | 'pool_bar' | 'hall_service';
          items: Array<{
            menu_item_id: string;
            quantity: number;
            unit_price: number;
            special_instructions?: string;
          }>;
          subtotal: number;
          tax_amount: number;
          service_charge: number;
          total_amount: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
          payment_status?: 'pending' | 'paid' | 'refunded';
          payment_method?: 'cash' | 'card' | 'room_charge' | 'mobile_money';
          special_instructions?: string;
          estimated_time?: number;
          served_by?: string;
        };
      };
      inventory: {
        Row: {
          id: string;
          item_name: string;
          category: 'food' | 'beverage' | 'alcohol' | 'amenity' | 'cleaning' | 'maintenance' | 'office' | 'kitchen_equipment' | 'bar_equipment';
          subcategory?: string;
          current_stock: number;
          minimum_stock: number;
          maximum_stock: number;
          unit: string;
          unit_cost: number;
          total_value: number;
          supplier: string;
          supplier_contact?: string;
          storage_location: string;
          expiry_date?: string;
          batch_number?: string;
          last_restocked: string;
          reorder_point: number;
          is_perishable: boolean;
          barcode?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          item_name: string;
          category: 'food' | 'beverage' | 'alcohol' | 'amenity' | 'cleaning' | 'maintenance' | 'office' | 'kitchen_equipment' | 'bar_equipment';
          subcategory?: string;
          current_stock: number;
          minimum_stock: number;
          maximum_stock: number;
          unit: string;
          unit_cost: number;
          total_value: number;
          supplier: string;
          supplier_contact?: string;
          storage_location: string;
          expiry_date?: string;
          batch_number?: string;
          last_restocked?: string;
          reorder_point: number;
          is_perishable?: boolean;
          barcode?: string;
        };
        Update: {
          current_stock?: number;
          minimum_stock?: number;
          maximum_stock?: number;
          unit_cost?: number;
          total_value?: number;
          supplier?: string;
          supplier_contact?: string;
          storage_location?: string;
          expiry_date?: string;
          batch_number?: string;
          last_restocked?: string;
          reorder_point?: number;
          is_perishable?: boolean;
          barcode?: string;
        };
      };
      maintenance_requests: {
        Row: {
          id: string;
          request_number: string;
          title: string;
          description: string;
          category: 'electrical' | 'plumbing' | 'hvac' | 'furniture' | 'appliance' | 'structural' | 'safety' | 'other';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
          location: string;
          room_id?: string;
          hall_id?: string;
          reported_by: string;
          assigned_to?: string;
          estimated_cost?: number;
          actual_cost?: number;
          estimated_completion?: string;
          completed_at?: string;
          parts_needed?: Array<{
            item: string;
            quantity: number;
            cost: number;
          }>;
          work_notes?: string;
          images?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          request_number: string;
          title: string;
          description: string;
          category: 'electrical' | 'plumbing' | 'hvac' | 'furniture' | 'appliance' | 'structural' | 'safety' | 'other';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          status?: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
          location: string;
          room_id?: string;
          hall_id?: string;
          reported_by: string;
          assigned_to?: string;
          estimated_cost?: number;
          actual_cost?: number;
          estimated_completion?: string;
          completed_at?: string;
          parts_needed?: Array<{
            item: string;
            quantity: number;
            cost: number;
          }>;
          work_notes?: string;
          images?: string[];
        };
      };
      transactions: {
        Row: {
          id: string;
          transaction_number: string;
          type: 'income' | 'expense';
          category: 'room_revenue' | 'hall_revenue' | 'food_beverage' | 'other_revenue' | 'utilities' | 'supplies' | 'maintenance' | 'salaries' | 'marketing' | 'other_expense';
          subcategory?: string;
          amount: number;
          description: string;
          reference_id?: string; // booking_id, order_id, etc.
          payment_method?: 'cash' | 'card' | 'bank_transfer' | 'mobile_money' | 'check';
          account?: string;
          tax_amount?: number;
          receipt_number?: string;
          receipt_url?: string;
          processed_by: string;
          approved_by?: string;
          transaction_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          transaction_number: string;
          type: 'income' | 'expense';
          category: 'room_revenue' | 'hall_revenue' | 'food_beverage' | 'other_revenue' | 'utilities' | 'supplies' | 'maintenance' | 'salaries' | 'marketing' | 'other_expense';
          subcategory?: string;
          amount: number;
          description: string;
          reference_id?: string;
          payment_method?: 'cash' | 'card' | 'bank_transfer' | 'mobile_money' | 'check';
          account?: string;
          tax_amount?: number;
          receipt_number?: string;
          receipt_url?: string;
          processed_by: string;
          approved_by?: string;
          transaction_date: string;
        };
      };
      pool_sessions: {
        Row: {
          id: string;
          session_date: string;
          start_time: string;
          end_time: string;
          current_occupancy: number;
          max_capacity: number;
          temperature: number;
          ph_level?: number;
          chlorine_level?: number;
          status: 'open' | 'closed' | 'maintenance' | 'private_event';
          lifeguard_on_duty?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          session_date: string;
          start_time: string;
          end_time: string;
          current_occupancy?: number;
          max_capacity: number;
          temperature: number;
          ph_level?: number;
          chlorine_level?: number;
          status?: 'open' | 'closed' | 'maintenance' | 'private_event';
          lifeguard_on_duty?: string;
          notes?: string;
        };
      };
    };
  };
}