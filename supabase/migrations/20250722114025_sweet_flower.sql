/*
  # Insert Sample Data for Hotel Management System

  1. Sample Data
    - Default admin user profile
    - Sample hotel rooms with different types
    - Sample menu items for restaurant and bar
    - Sample inventory items
    - Sample bookings and orders

  2. Purpose
    - Provide realistic demo data for testing
    - Show all system features working
    - Enable immediate use of the application
*/

-- Insert default admin profile (if not exists)
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@hotel.com',
  'System Administrator',
  'admin'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample rooms
INSERT INTO rooms (room_number, room_type, status, price_per_night, amenities, floor, max_occupancy) VALUES
('101', 'single', 'available', 120.00, '{"WiFi", "TV", "Air Conditioning"}', 1, 1),
('102', 'double', 'occupied', 180.00, '{"WiFi", "TV", "Air Conditioning", "Mini Bar"}', 1, 2),
('103', 'suite', 'available', 350.00, '{"WiFi", "TV", "Air Conditioning", "Mini Bar", "Balcony", "Kitchen"}', 1, 4),
('104', 'single', 'maintenance', 120.00, '{"WiFi", "TV", "Air Conditioning"}', 1, 1),
('105', 'double', 'occupied', 180.00, '{"WiFi", "TV", "Air Conditioning", "Mini Bar"}', 1, 2),
('201', 'deluxe', 'available', 250.00, '{"WiFi", "TV", "Air Conditioning", "Mini Bar", "Balcony"}', 2, 2),
('202', 'suite', 'occupied', 350.00, '{"WiFi", "TV", "Air Conditioning", "Mini Bar", "Balcony", "Kitchen"}', 2, 4),
('203', 'presidential', 'available', 500.00, '{"WiFi", "TV", "Air Conditioning", "Mini Bar", "Balcony", "Kitchen", "Jacuzzi", "Butler Service"}', 2, 6),
('301', 'double', 'cleaning', 180.00, '{"WiFi", "TV", "Air Conditioning", "Mini Bar"}', 3, 2),
('302', 'deluxe', 'available', 250.00, '{"WiFi", "TV", "Air Conditioning", "Mini Bar", "Balcony"}', 3, 2)
ON CONFLICT (room_number) DO NOTHING;

-- Insert sample menu items - Restaurant
INSERT INTO menu_items (name, description, category, price, ingredients, recipe_instructions, prep_time_minutes, is_available) VALUES
('Caesar Salad', 'Fresh romaine lettuce with parmesan cheese and croutons', 'appetizer', 12.99, '{"romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"}', 'Toss lettuce with dressing, top with cheese and croutons', 10, true),
('Grilled Salmon', 'Atlantic salmon with lemon herb butter', 'main_course', 28.99, '{"salmon fillet", "lemon", "herbs", "butter", "vegetables"}', 'Grill salmon for 6-8 minutes per side, serve with vegetables', 20, true),
('Beef Tenderloin', 'Premium beef with red wine reduction', 'main_course', 42.99, '{"beef tenderloin", "red wine", "shallots", "butter", "herbs"}', 'Sear beef, finish in oven, prepare reduction sauce', 25, true),
('Chocolate Lava Cake', 'Warm chocolate cake with vanilla ice cream', 'dessert', 9.99, '{"dark chocolate", "butter", "eggs", "flour", "vanilla ice cream"}', 'Bake until edges are firm but center is soft', 15, true),
('Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 'dessert', 8.99, '{"ladyfingers", "coffee", "mascarpone", "eggs", "cocoa powder"}', 'Layer ingredients and chill for 4 hours', 30, true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample menu items - Bar
INSERT INTO menu_items (name, description, category, price, ingredients, recipe_instructions, prep_time_minutes, is_available) VALUES
('Mojito', 'Classic Cuban cocktail with mint and lime', 'cocktail', 12.00, '{"white rum", "mint leaves", "lime juice", "sugar", "soda water"}', 'Muddle mint and lime, add rum and sugar, top with soda', 5, true),
('Old Fashioned', 'Whiskey cocktail with bitters and orange', 'cocktail', 14.00, '{"bourbon whiskey", "sugar", "bitters", "orange peel"}', 'Muddle sugar and bitters, add whiskey, garnish with orange', 5, true),
('Pinot Grigio', 'Crisp Italian white wine', 'wine', 8.00, '{"pinot grigio grapes"}', 'Serve chilled in wine glass', 2, true),
('Cabernet Sauvignon', 'Full-bodied red wine from Napa Valley', 'wine', 12.00, '{"cabernet sauvignon grapes"}', 'Serve at room temperature', 2, true),
('Craft Beer', 'Local IPA on tap', 'beverage', 6.00, '{"hops", "malt", "yeast", "water"}', 'Serve in chilled glass', 2, true),
('Fresh Orange Juice', 'Freshly squeezed orange juice', 'beverage', 4.00, '{"fresh oranges"}', 'Squeeze oranges and serve immediately', 3, true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory (item_name, category, current_stock, minimum_stock, unit_cost, supplier) VALUES
('Salmon Fillets', 'food', 25, 10, 15.99, 'Ocean Fresh Seafood'),
('Beef Tenderloin', 'food', 8, 5, 32.50, 'Premium Meats Co'),
('Romaine Lettuce', 'food', 50, 20, 2.99, 'Fresh Farms Supply'),
('White Wine', 'beverage', 24, 12, 18.00, 'Wine Distributors Inc'),
('Bourbon Whiskey', 'beverage', 6, 3, 45.00, 'Spirits & More'),
('Towels', 'amenity', 100, 30, 12.99, 'Hotel Supplies Plus'),
('Toilet Paper', 'cleaning', 200, 50, 1.50, 'Cleaning Essentials'),
('Shampoo Bottles', 'amenity', 75, 25, 3.99, 'Guest Amenities Co'),
('Coffee Beans', 'food', 15, 8, 12.99, 'Roasters United'),
('Cleaning Spray', 'cleaning', 45, 15, 4.99, 'Cleaning Essentials')
ON CONFLICT (item_name) DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (guest_name, guest_email, guest_phone, room_id, check_in, check_out, total_amount, deposit_amount, payment_status, booking_status, special_requests) VALUES
('John Smith', 'john.smith@email.com', '+1-555-0101', (SELECT id FROM rooms WHERE room_number = '102'), CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', 540.00, 180.00, 'paid', 'checked_in', 'Late check-in requested'),
('Sarah Johnson', 'sarah.j@email.com', '+1-555-0102', (SELECT id FROM rooms WHERE room_number = '105'), CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days', 540.00, 180.00, 'paid', 'checked_in', 'Extra towels please'),
('Mike Davis', 'mike.davis@email.com', '+1-555-0103', (SELECT id FROM rooms WHERE room_number = '202'), CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day', 350.00, 100.00, 'partial', 'confirmed', 'Vegetarian meals only'),
('Emily Wilson', 'emily.w@email.com', '+1-555-0104', (SELECT id FROM rooms WHERE room_number = '203'), CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '5 days', 2000.00, 500.00, 'paid', 'confirmed', 'Anniversary celebration')
ON CONFLICT DO NOTHING;

-- Insert sample orders
INSERT INTO orders (booking_id, table_number, order_type, items, total_amount, status, payment_status) VALUES
((SELECT id FROM bookings WHERE guest_name = 'John Smith'), NULL, 'room_service', '[{"menu_item_id": "' || (SELECT id FROM menu_items WHERE name = 'Grilled Salmon') || '", "quantity": 2, "special_instructions": "No vegetables"}]', 57.98, 'preparing', 'pending'),
(NULL, '5', 'restaurant', '[{"menu_item_id": "' || (SELECT id FROM menu_items WHERE name = 'Caesar Salad') || '", "quantity": 1}, {"menu_item_id": "' || (SELECT id FROM menu_items WHERE name = 'Beef Tenderloin') || '", "quantity": 1}]', 55.98, 'pending', 'pending'),
(NULL, '12', 'bar', '[{"menu_item_id": "' || (SELECT id FROM menu_items WHERE name = 'Mojito') || '", "quantity": 2}, {"menu_item_id": "' || (SELECT id FROM menu_items WHERE name = 'Craft Beer') || '", "quantity": 1}]', 30.00, 'ready', 'pending')
ON CONFLICT DO NOTHING;

-- Insert sample expenses
INSERT INTO expenses (description, amount, category, date, approved_by) VALUES
('Monthly electricity bill', 2500.00, 'utilities', CURRENT_DATE - INTERVAL '5 days', (SELECT id FROM profiles WHERE email = 'admin@hotel.com')),
('Kitchen equipment repair', 450.00, 'maintenance', CURRENT_DATE - INTERVAL '3 days', (SELECT id FROM profiles WHERE email = 'admin@hotel.com')),
('Fresh produce delivery', 800.00, 'supplies', CURRENT_DATE - INTERVAL '2 days', (SELECT id FROM profiles WHERE email = 'admin@hotel.com')),
('Staff uniforms', 320.00, 'supplies', CURRENT_DATE - INTERVAL '1 day', (SELECT id FROM profiles WHERE email = 'admin@hotel.com')),
('Marketing materials', 150.00, 'marketing', CURRENT_DATE, (SELECT id FROM profiles WHERE email = 'admin@hotel.com'))
ON CONFLICT DO NOTHING;