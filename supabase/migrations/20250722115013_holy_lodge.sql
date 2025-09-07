@@ .. @@
 CREATE TRIGGER inventory_updated_at
   BEFORE UPDATE ON inventory
   FOR EACH ROW
   EXECUTE FUNCTION handle_updated_at();
-
--- Insert default admin user (requires manual setup in Supabase Auth)
--- After running this migration, create an admin user through Supabase Auth UI
--- Then run: INSERT INTO profiles (id, email, full_name, role) 
--- VALUES ('[user-id-from-auth]', 'admin@hotel.com', 'System Administrator', 'admin');