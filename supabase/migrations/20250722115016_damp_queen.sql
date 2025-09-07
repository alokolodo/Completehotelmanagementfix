@@ .. @@
   This file contains sample data for testing the hotel management system.
 */
 
--- Note: Admin user must be created manually through Supabase Auth UI first
--- Then add profile: INSERT INTO profiles (id, email, full_name, role) 
--- VALUES ('[auth-user-id]', 'your-admin@email.com', 'Admin Name', 'admin')
-
 -- Insert sample rooms
 INSERT INTO rooms (room_number, room_type, status, price_per_night, amenities, floor, max_occupancy) VALUES