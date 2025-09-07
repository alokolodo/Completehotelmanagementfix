/*
  # Hotel Management System Database Schema

  1. New Tables
    - `profiles` - User profiles with roles (manager, receptionist, kitchen_staff, bar_staff, housekeeping, admin)
    - `rooms` - Hotel rooms with status, type, pricing, and amenities
    - `bookings` - Guest reservations with payment and status tracking
    - `menu_items` - Restaurant and bar menu items with recipes and pricing
    - `orders` - Food and beverage orders from restaurant, bar, and pool
    - `inventory` - Stock management for all hotel supplies
    - `expenses` - Financial expense tracking by category

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for role-based access
    - Secure data access based on user roles

  3. Features
    - Comprehensive hotel operations management
    - Real-time order tracking
    - Inventory management with low stock alerts
    - Financial reporting and expense tracking
    - Multi-role user management
*/

-- Create custom types
CREATE TYPE user_role AS ENUM (
  'manager',
  'receptionist', 
  'kitchen_staff',
  'bar_staff',
  'housekeeping',
  'admin'
);

CREATE TYPE room_type AS ENUM (
  'single',
  'double',
  'suite',
  'deluxe',
  'presidential'
);

CREATE TYPE room_status AS ENUM (
  'available',
  'occupied',
  'maintenance',
  'cleaning',
  'reserved'
);

CREATE TYPE booking_status AS ENUM (
  'confirmed',
  'checked_in',
  'checked_out',
  'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'partial',
  'paid',
  'refunded'
);

CREATE TYPE menu_category AS ENUM (
  'appetizer',
  'main_course',
  'dessert',
  'beverage',
  'wine',
  'cocktail'
);

CREATE TYPE order_type AS ENUM (
  'room_service',
  'restaurant',
  'bar',
  'pool_bar'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'preparing',
  'ready',
  'served',
  'cancelled'
);

CREATE TYPE inventory_category AS ENUM (
  'food',
  'beverage',
  'amenity',
  'cleaning',
  'maintenance',
  'office'
);

CREATE TYPE expense_category AS ENUM (
  'utilities',
  'supplies',
  'maintenance',
  'salaries',
  'marketing',
  'other'
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'receptionist',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number text UNIQUE NOT NULL,
  room_type room_type NOT NULL,
  status room_status NOT NULL DEFAULT 'available',
  price_per_night decimal(10,2) NOT NULL,
  amenities text[] DEFAULT '{}',
  floor integer NOT NULL,
  max_occupancy integer NOT NULL DEFAULT 2,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text,
  room_id uuid NOT NULL REFERENCES rooms(id),
  check_in date NOT NULL,
  check_out date NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  deposit_amount decimal(10,2) DEFAULT 0,
  payment_status payment_status DEFAULT 'pending',
  booking_status booking_status DEFAULT 'confirmed',
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category menu_category NOT NULL,
  price decimal(10,2) NOT NULL,
  ingredients text[] DEFAULT '{}',
  recipe_instructions text,
  prep_time_minutes integer,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  table_number text,
  order_type order_type NOT NULL,
  items jsonb NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  category inventory_category NOT NULL,
  current_stock integer NOT NULL DEFAULT 0,
  minimum_stock integer NOT NULL DEFAULT 0,
  unit_cost decimal(10,2) NOT NULL,
  supplier text NOT NULL,
  last_restocked timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  category expense_category NOT NULL,
  date date NOT NULL,
  receipt_url text,
  approved_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Managers can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Create policies for rooms
CREATE POLICY "All authenticated users can read rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can update room status"
  ON rooms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin', 'receptionist', 'housekeeping')
    )
  );

CREATE POLICY "Managers can insert rooms"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Create policies for bookings
CREATE POLICY "Staff can read all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin', 'receptionist')
    )
  );

CREATE POLICY "Staff can manage bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin', 'receptionist')
    )
  );

-- Create policies for menu_items
CREATE POLICY "All authenticated users can read menu items"
  ON menu_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Kitchen and bar staff can manage menu items"
  ON menu_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin', 'kitchen_staff', 'bar_staff')
    )
  );

-- Create policies for orders
CREATE POLICY "Staff can read relevant orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND (
        p.role IN ('manager', 'admin', 'receptionist') OR
        (p.role = 'kitchen_staff' AND order_type IN ('restaurant', 'room_service')) OR
        (p.role = 'bar_staff' AND order_type IN ('bar', 'pool_bar'))
      )
    )
  );

CREATE POLICY "Staff can manage relevant orders"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND (
        p.role IN ('manager', 'admin', 'receptionist') OR
        (p.role = 'kitchen_staff' AND order_type IN ('restaurant', 'room_service')) OR
        (p.role = 'bar_staff' AND order_type IN ('bar', 'pool_bar'))
      )
    )
  );

-- Create policies for inventory
CREATE POLICY "Staff can read inventory"
  ON inventory FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin', 'kitchen_staff', 'bar_staff')
    )
  );

CREATE POLICY "Staff can manage inventory"
  ON inventory FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin', 'kitchen_staff', 'bar_staff')
    )
  );

-- Create policies for expenses
CREATE POLICY "Managers can read all expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers can manage expenses"
  ON expenses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();