import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet, ChefHat, Package, Building, Users, Wrench, Calculator, Bed, Calendar, Wine, Waves, BookOpen } from 'lucide-react-native';

interface ExcelTemplateDownloaderProps {
  templateType: 'menu' | 'inventory' | 'bookings' | 'rooms' | 'halls' | 'staff' | 'maintenance' | 'recipes' | 'bar' | 'restaurant' | 'pool' | 'accounting' | 'analytics' | 'all';
  onDownloadComplete?: () => void;
}

export function ExcelTemplateDownloader({ templateType, onDownloadComplete }: ExcelTemplateDownloaderProps) {
  
  const generateMenuTemplate = async () => {
    try {
      const menuData = [
        {
          name: 'Grilled Salmon',
          description: 'Fresh Atlantic salmon with lemon herb butter',
          category: 'main_course',
          subcategory: 'seafood',
          price: 28.99,
          cost_price: 15.50,
          ingredients: 'salmon fillet, lemon, herbs, butter, vegetables',
          allergens: 'fish',
          prep_time_minutes: 15,
          cooking_time_minutes: 20,
          difficulty_level: 'medium',
          is_vegetarian: false,
          is_vegan: false,
          is_gluten_free: true,
          calories: 450
        },
        {
          name: 'Caesar Salad',
          description: 'Crisp romaine lettuce with parmesan and croutons',
          category: 'appetizer',
          subcategory: 'salad',
          price: 12.99,
          cost_price: 6.50,
          ingredients: 'romaine lettuce, parmesan cheese, croutons, caesar dressing',
          allergens: 'dairy, gluten',
          prep_time_minutes: 10,
          cooking_time_minutes: 0,
          difficulty_level: 'easy',
          is_vegetarian: true,
          is_vegan: false,
          is_gluten_free: false,
          calories: 280
        },
        {
          name: 'Classic Mojito',
          description: 'Refreshing Cuban cocktail with mint and lime',
          category: 'cocktail',
          subcategory: 'rum_based',
          price: 12.00,
          cost_price: 4.50,
          ingredients: 'white rum, mint leaves, lime juice, sugar, soda water',
          allergens: '',
          prep_time_minutes: 5,
          cooking_time_minutes: 0,
          difficulty_level: 'easy',
          is_vegetarian: true,
          is_vegan: true,
          is_gluten_free: true,
          calories: 150
        },
        {
          name: 'Beef Tenderloin',
          description: 'Premium beef with red wine reduction',
          category: 'main_course',
          subcategory: 'beef',
          price: 42.99,
          cost_price: 25.00,
          ingredients: 'beef tenderloin, red wine, shallots, butter, herbs',
          allergens: '',
          prep_time_minutes: 20,
          cooking_time_minutes: 25,
          difficulty_level: 'hard',
          is_vegetarian: false,
          is_vegan: false,
          is_gluten_free: true,
          calories: 650
        },
        {
          name: 'Vegetarian Pasta',
          description: 'Fresh pasta with seasonal vegetables',
          category: 'main_course',
          subcategory: 'pasta',
          price: 19.99,
          cost_price: 8.50,
          ingredients: 'pasta, zucchini, bell peppers, tomatoes, olive oil, herbs',
          allergens: 'gluten',
          prep_time_minutes: 15,
          cooking_time_minutes: 20,
          difficulty_level: 'easy',
          is_vegetarian: true,
          is_vegan: true,
          is_gluten_free: false,
          calories: 420
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(menuData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Menu Items');

      // Add instructions sheet
      const instructions = [
        { instruction: 'Hotel Management System - Menu Items Import Template' },
        { instruction: '' },
        { instruction: 'VALID CATEGORIES:' },
        { instruction: 'appetizer, main_course, dessert, beverage, wine, beer, cocktail, spirits, coffee, tea, juice, water' },
        { instruction: '' },
        { instruction: 'DIFFICULTY LEVELS:' },
        { instruction: 'easy, medium, hard' },
        { instruction: '' },
        { instruction: 'BOOLEAN FIELDS:' },
        { instruction: 'Use true/false for is_vegetarian, is_vegan, is_gluten_free' },
        { instruction: '' },
        { instruction: 'INGREDIENTS:' },
        { instruction: 'Separate multiple ingredients with commas' },
        { instruction: '' },
        { instruction: 'REQUIRED FIELDS:' },
        { instruction: 'name*, description*, category*, price*, cost_price*' },
        { instruction: '' },
        { instruction: 'IMPORT INSTRUCTIONS:' },
        { instruction: '1. Fill in your menu data following the sample format' },
        { instruction: '2. Keep column headers exactly as shown' },
        { instruction: '3. Save as .xlsx format' },
        { instruction: '4. Use Menu Management > Import function' },
        { instruction: '' },
        { instruction: 'SUPPORT: support@hotelmanagementsystem.com' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Import Instructions');

      return workbook;
    } catch (error) {
      console.error('Error generating menu template:', error);
      throw error;
    }
  };

  const generateInventoryTemplate = async () => {
    try {
      const inventoryData = [
        {
          item_name: 'Salmon Fillets',
          category: 'food',
          subcategory: 'seafood',
          current_stock: 25,
          minimum_stock: 10,
          maximum_stock: 50,
          unit: 'pieces',
          unit_cost: 15.99,
          supplier: 'Ocean Fresh Seafood',
          supplier_contact: '+1-555-0101',
          storage_location: 'Walk-in Freezer A',
          expiry_date: '2024-02-15',
          is_perishable: true,
          barcode: '1234567890123'
        },
        {
          item_name: 'White Rum',
          category: 'alcohol',
          subcategory: 'spirits',
          current_stock: 12,
          minimum_stock: 5,
          maximum_stock: 30,
          unit: 'bottles',
          unit_cost: 25.00,
          supplier: 'Premium Spirits Co',
          supplier_contact: '+1-555-0104',
          storage_location: 'Bar Storage',
          expiry_date: '',
          is_perishable: false,
          barcode: '9876543210987'
        },
        {
          item_name: 'All-Purpose Cleaner',
          category: 'cleaning',
          subcategory: 'chemicals',
          current_stock: 45,
          minimum_stock: 15,
          maximum_stock: 100,
          unit: 'bottles',
          unit_cost: 4.99,
          supplier: 'Cleaning Essentials',
          supplier_contact: '+1-555-0106',
          storage_location: 'Housekeeping Storage',
          expiry_date: '',
          is_perishable: false,
          barcode: '3456789012345'
        },
        {
          item_name: 'Coffee Beans',
          category: 'food',
          subcategory: 'beverages',
          current_stock: 15,
          minimum_stock: 8,
          maximum_stock: 40,
          unit: 'kg',
          unit_cost: 12.99,
          supplier: 'Roasters United',
          supplier_contact: '+1-555-0112',
          storage_location: 'Kitchen Pantry',
          expiry_date: '2024-06-15',
          is_perishable: true,
          barcode: '4567890123456'
        },
        {
          item_name: 'Wine Glasses',
          category: 'bar_equipment',
          subcategory: 'glassware',
          current_stock: 48,
          minimum_stock: 20,
          maximum_stock: 100,
          unit: 'pieces',
          unit_cost: 8.50,
          supplier: 'Bar Equipment Pro',
          supplier_contact: '+1-555-0109',
          storage_location: 'Bar Storage',
          expiry_date: '',
          is_perishable: false,
          barcode: '5678901234567'
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(inventoryData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Items');

      // Add instructions sheet
      const instructions = [
        { instruction: 'Hotel Management System - Inventory Import Template' },
        { instruction: '' },
        { instruction: 'VALID CATEGORIES:' },
        { instruction: 'food, beverage, alcohol, amenity, cleaning, maintenance, office, kitchen_equipment, bar_equipment' },
        { instruction: '' },
        { instruction: 'UNITS:' },
        { instruction: 'pieces, kg, liters, bottles, boxes, etc.' },
        { instruction: '' },
        { instruction: 'DATE FORMAT:' },
        { instruction: 'Use YYYY-MM-DD format for expiry_date' },
        { instruction: '' },
        { instruction: 'BOOLEAN FIELDS:' },
        { instruction: 'Use true/false for is_perishable' },
        { instruction: '' },
        { instruction: 'REQUIRED FIELDS:' },
        { instruction: 'item_name*, category*, unit_cost*, supplier*' },
        { instruction: '' },
        { instruction: 'IMPORT INSTRUCTIONS:' },
        { instruction: '1. Fill in your inventory data following the sample format' },
        { instruction: '2. Keep column headers exactly as shown' },
        { instruction: '3. Save as .xlsx format' },
        { instruction: '4. Use Store Management > Import function' },
        { instruction: '' },
        { instruction: 'SUPPORT: support@hotelmanagementsystem.com' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Import Instructions');

      return workbook;
    } catch (error) {
      console.error('Error generating inventory template:', error);
      throw error;
    }
  };

  const generateBookingsTemplate = async () => {
    try {
      const bookingsData = [
        {
          guest_name: 'John Smith',
          guest_email: 'john.smith@email.com',
          guest_phone: '+1-555-0101',
          guest_id_number: 'ID123456789',
          room_number: '101',
          check_in: '2024-02-15',
          check_out: '2024-02-18',
          adults: 2,
          children: 0,
          total_amount: 360.00,
          deposit_amount: 120.00,
          payment_status: 'paid',
          booking_status: 'confirmed',
          special_requests: 'Late check-in requested'
        },
        {
          guest_name: 'Sarah Johnson',
          guest_email: 'sarah.j@email.com',
          guest_phone: '+1-555-0102',
          guest_id_number: 'ID987654321',
          room_number: '201',
          check_in: '2024-02-20',
          check_out: '2024-02-22',
          adults: 1,
          children: 1,
          total_amount: 360.00,
          deposit_amount: 100.00,
          payment_status: 'partial',
          booking_status: 'confirmed',
          special_requests: 'Extra towels please'
        },
        {
          guest_name: 'Mike Davis',
          guest_email: 'mike.davis@email.com',
          guest_phone: '+1-555-0103',
          guest_id_number: 'ID456789123',
          room_number: '301',
          check_in: '2024-02-25',
          check_out: '2024-02-27',
          adults: 2,
          children: 2,
          total_amount: 700.00,
          deposit_amount: 200.00,
          payment_status: 'paid',
          booking_status: 'confirmed',
          special_requests: 'Connecting rooms preferred'
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(bookingsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Guest Bookings');

      // Add instructions sheet
      const instructions = [
        { instruction: 'Hotel Management System - Guest Bookings Import Template' },
        { instruction: '' },
        { instruction: 'DATE FORMAT:' },
        { instruction: 'Use YYYY-MM-DD format for check_in and check_out' },
        { instruction: '' },
        { instruction: 'PAYMENT STATUS OPTIONS:' },
        { instruction: 'pending, partial, paid, refunded, overdue' },
        { instruction: '' },
        { instruction: 'BOOKING STATUS OPTIONS:' },
        { instruction: 'confirmed, checked_in, checked_out, cancelled, no_show' },
        { instruction: '' },
        { instruction: 'REQUIRED FIELDS:' },
        { instruction: 'guest_name*, guest_email*, room_number*, check_in*, check_out*, adults*, total_amount*' },
        { instruction: '' },
        { instruction: 'NOTES:' },
        { instruction: 'Room number must exist in the system' },
        { instruction: 'Check-out date must be after check-in date' },
        { instruction: '' },
        { instruction: 'IMPORT INSTRUCTIONS:' },
        { instruction: '1. Fill in your booking data following the sample format' },
        { instruction: '2. Ensure room numbers exist in your system' },
        { instruction: '3. Save as .xlsx format' },
        { instruction: '4. Use Bookings > Import function' },
        { instruction: '' },
        { instruction: 'SUPPORT: support@hotelmanagementsystem.com' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Import Instructions');

      return workbook;
    } catch (error) {
      console.error('Error generating bookings template:', error);
      throw error;
    }
  };

  const generateRoomsTemplate = async () => {
    try {
      const roomsData = [
        {
          room_number: '101',
          room_type: 'standard',
          status: 'available',
          price_per_night: 120.00,
          amenities: 'WiFi, TV, AC, Private Bath',
          floor: 1,
          max_occupancy: 2,
          description: 'Comfortable standard room with city view',
          checkout_time: '12:00'
        },
        {
          room_number: '201',
          room_type: 'deluxe',
          status: 'available',
          price_per_night: 180.00,
          amenities: 'WiFi, TV, AC, Mini Bar, Balcony, Room Service',
          floor: 2,
          max_occupancy: 3,
          description: 'Spacious deluxe room with balcony and city view',
          checkout_time: '12:00'
        },
        {
          room_number: '301',
          room_type: 'suite',
          status: 'available',
          price_per_night: 350.00,
          amenities: 'WiFi, TV, AC, Mini Bar, Balcony, Kitchen, Living Room, Butler Service',
          floor: 3,
          max_occupancy: 4,
          description: 'Luxury suite with separate living area and kitchen',
          checkout_time: '12:00'
        },
        {
          room_number: '401',
          room_type: 'presidential',
          status: 'available',
          price_per_night: 500.00,
          amenities: 'WiFi, TV, AC, Mini Bar, Balcony, Kitchen, Living Room, Butler Service, Jacuzzi, Private Terrace',
          floor: 4,
          max_occupancy: 6,
          description: 'Ultimate luxury presidential suite with panoramic views',
          checkout_time: '12:00'
        },
        {
          room_number: '105',
          room_type: 'family',
          status: 'available',
          price_per_night: 220.00,
          amenities: 'WiFi, TV, AC, Bunk Beds, Play Area, Mini Fridge',
          floor: 1,
          max_occupancy: 6,
          description: 'Perfect for families with children',
          checkout_time: '12:00'
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(roomsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Hotel Rooms');

      // Add instructions sheet
      const instructions = [
        { instruction: 'Hotel Management System - Hotel Rooms Import Template' },
        { instruction: '' },
        { instruction: 'ROOM TYPES:' },
        { instruction: 'standard, deluxe, suite, presidential, family, executive' },
        { instruction: '' },
        { instruction: 'ROOM STATUS OPTIONS:' },
        { instruction: 'available, occupied, maintenance, cleaning, reserved, out_of_order' },
        { instruction: '' },
        { instruction: 'AMENITIES:' },
        { instruction: 'Separate multiple amenities with commas' },
        { instruction: 'Examples: WiFi, TV, AC, Mini Bar, Balcony, Kitchen, etc.' },
        { instruction: '' },
        { instruction: 'REQUIRED FIELDS:' },
        { instruction: 'room_number*, room_type*, price_per_night*, floor*, max_occupancy*' },
        { instruction: '' },
        { instruction: 'IMPORT INSTRUCTIONS:' },
        { instruction: '1. Fill in your room data following the sample format' },
        { instruction: '2. Ensure room numbers are unique' },
        { instruction: '3. Save as .xlsx format' },
        { instruction: '4. Use Rooms > Import function' },
        { instruction: '' },
        { instruction: 'SUPPORT: support@hotelmanagementsystem.com' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Import Instructions');

      return workbook;
    } catch (error) {
      console.error('Error generating rooms template:', error);
      throw error;
    }
  };

  const generateHallsTemplate = async () => {
    try {
      const hallsData = [
        {
          hall_name: 'Grand Ballroom',
          hall_type: 'ballroom',
          capacity: 300,
          hourly_rate: 200.00,
          daily_rate: 1500.00,
          amenities: 'Sound System, Projector, Stage, Dance Floor, Bar, Kitchen Access, Parking',
          description: 'Elegant ballroom perfect for weddings, galas, and large corporate events',
          is_available: true
        },
        {
          hall_name: 'Conference Room A',
          hall_type: 'conference',
          capacity: 50,
          hourly_rate: 75.00,
          daily_rate: 500.00,
          amenities: 'Projector, Whiteboard, WiFi, Video Conferencing, Coffee Station',
          description: 'Modern conference room for business meetings and presentations',
          is_available: true
        },
        {
          hall_name: 'Banquet Hall',
          hall_type: 'banquet',
          capacity: 150,
          hourly_rate: 120.00,
          daily_rate: 800.00,
          amenities: 'Sound System, Kitchen Access, Bar Setup, Decorative Lighting',
          description: 'Perfect for dinner parties, celebrations, and corporate dinners',
          is_available: true
        }
      ];

      const hallBookingsData = [
        {
          hall_name: 'Grand Ballroom',
          client_name: 'Wedding Planners Inc',
          client_email: 'events@weddingplanners.com',
          client_phone: '+1-555-0201',
          event_type: 'Wedding Reception',
          start_datetime: '2024-03-15 18:00',
          end_datetime: '2024-03-15 23:00',
          total_amount: 2500.00,
          deposit_amount: 500.00,
          guest_count: 150,
          payment_status: 'partial',
          booking_status: 'confirmed',
          special_requirements: 'Vegetarian menu options, live band setup'
        },
        {
          hall_name: 'Conference Room A',
          client_name: 'Tech Corp',
          client_email: 'events@techcorp.com',
          client_phone: '+1-555-0202',
          event_type: 'Corporate Meeting',
          start_datetime: '2024-03-20 09:00',
          end_datetime: '2024-03-20 17:00',
          total_amount: 600.00,
          deposit_amount: 150.00,
          guest_count: 40,
          payment_status: 'paid',
          booking_status: 'confirmed',
          special_requirements: 'Video conferencing setup, coffee breaks'
        }
      ];

      const workbook = XLSX.utils.book_new();
      
      // Add halls sheet
      const hallsSheet = XLSX.utils.json_to_sheet(hallsData);
      XLSX.utils.book_append_sheet(workbook, hallsSheet, 'Event Halls');
      
      // Add hall bookings sheet
      const bookingsSheet = XLSX.utils.json_to_sheet(hallBookingsData);
      XLSX.utils.book_append_sheet(workbook, bookingsSheet, 'Hall Bookings');

      // Add instructions sheet
      const instructions = [
        { instruction: 'Hotel Management System - Halls & Events Import Template' },
        { instruction: '' },
        { instruction: 'HALL TYPES:' },
        { instruction: 'conference, banquet, wedding, meeting, exhibition, ballroom' },
        { instruction: '' },
        { instruction: 'BOOKING STATUS OPTIONS:' },
        { instruction: 'confirmed, in_progress, completed, cancelled' },
        { instruction: '' },
        { instruction: 'PAYMENT STATUS OPTIONS:' },
        { instruction: 'pending, partial, paid, refunded' },
        { instruction: '' },
        { instruction: 'DATETIME FORMAT:' },
        { instruction: 'Use YYYY-MM-DD HH:MM format for start_datetime and end_datetime' },
        { instruction: '' },
        { instruction: 'REQUIRED FIELDS - HALLS:' },
        { instruction: 'hall_name*, hall_type*, capacity*, hourly_rate*, daily_rate*' },
        { instruction: '' },
        { instruction: 'REQUIRED FIELDS - BOOKINGS:' },
        { instruction: 'hall_name*, client_name*, client_email*, event_type*, start_datetime*, end_datetime*, guest_count*' },
        { instruction: '' },
        { instruction: 'IMPORT INSTRUCTIONS:' },
        { instruction: '1. Use separate sheets for halls and bookings' },
        { instruction: '2. Import halls first, then bookings' },
        { instruction: '3. Save as .xlsx format' },
        { instruction: '4. Use Halls > Import function' },
        { instruction: '' },
        { instruction: 'SUPPORT: support@hotelmanagementsystem.com' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Import Instructions');

      return workbook;
    } catch (error) {
      console.error('Error generating halls template:', error);
      throw error;
    }
  };

  const generateStaffTemplate = async () => {
    try {
      const staffData = [
        {
          full_name: 'John Manager',
          email: 'john.manager@hotel.com',
          role: 'manager',
          phone: '+1-555-1001',
          department: 'Management',
          start_date: '2024-01-15',
          is_active: true,
          employee_id: 'EMP001'
        },
        {
          full_name: 'Sarah Receptionist',
          email: 'sarah.reception@hotel.com',
          role: 'receptionist',
          phone: '+1-555-1002',
          department: 'Front Desk',
          start_date: '2024-01-20',
          is_active: true,
          employee_id: 'EMP002'
        },
        {
          full_name: 'Mike Chef',
          email: 'mike.chef@hotel.com',
          role: 'kitchen_staff',
          phone: '+1-555-1003',
          department: 'Kitchen',
          start_date: '2024-02-01',
          is_active: true,
          employee_id: 'EMP003'
        },
        {
          full_name: 'Lisa Bartender',
          email: 'lisa.bar@hotel.com',
          role: 'bar_staff',
          phone: '+1-555-1004',
          department: 'Bar',
          start_date: '2024-02-05',
          is_active: true,
          employee_id: 'EMP004'
        },
        {
          full_name: 'Tom Maintenance',
          email: 'tom.maintenance@hotel.com',
          role: 'maintenance',
          phone: '+1-555-1005',
          department: 'Maintenance',
          start_date: '2024-01-25',
          is_active: true,
          employee_id: 'EMP005'
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(staffData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Staff Members');

      // Add instructions sheet
      const instructions = [
        { instruction: 'Hotel Management System - Staff Management Import Template' },
        { instruction: '' },
        { instruction: 'VALID ROLES:' },
        { instruction: 'admin, manager, receptionist, kitchen_staff, bar_staff, housekeeping, maintenance, accountant, store_keeper' },
        { instruction: '' },
        { instruction: 'DATE FORMAT:' },
        { instruction: 'Use YYYY-MM-DD format for start_date' },
        { instruction: '' },
        { instruction: 'BOOLEAN FIELDS:' },
        { instruction: 'Use true/false for is_active' },
        { instruction: '' },
        { instruction: 'REQUIRED FIELDS:' },
        { instruction: 'full_name*, email*, role*' },
        { instruction: '' },
        { instruction: 'IMPORT INSTRUCTIONS:' },
        { instruction: '1. Fill in your staff data following the sample format' },
        { instruction: '2. Ensure email addresses are unique' },
        { instruction: '3. Save as .xlsx format' },
        { instruction: '4. Use Staff > Import function' },
        { instruction: '5. Staff will receive login credentials via email' },
        { instruction: '' },
        { instruction: 'SUPPORT: support@hotelmanagementsystem.com' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Import Instructions');

      return workbook;
    } catch (error) {
      console.error('Error generating staff template:', error);
      throw error;
    }
  };

  const generateMaintenanceTemplate = async () => {
    try {
      const maintenanceData = [
        {
          title: 'Air Conditioning Repair',
          description: 'AC unit in room 102 not cooling properly',
          category: 'hvac',
          priority: 'high',
          location: 'Room 102',
          room_number: '102',
          estimated_cost: 150.00,
          parts_needed: 'AC Filter, Refrigerant',
          work_notes: 'Check refrigerant levels and replace filter',
          reported_by: 'Front Desk',
          status: 'pending'
        },
        {
          title: 'Leaky Faucet',
          description: 'Bathroom faucet dripping in presidential suite',
          category: 'plumbing',
          priority: 'medium',
          location: 'Room 401 Bathroom',
          room_number: '401',
          estimated_cost: 75.00,
          parts_needed: 'Faucet Cartridge',
          work_notes: 'Replace faucet cartridge and check water pressure',
          reported_by: 'Housekeeping',
          status: 'pending'
        },
        {
          title: 'Broken Light Fixture',
          description: 'Ceiling light not working in conference room',
          category: 'electrical',
          priority: 'medium',
          location: 'Conference Room A',
          hall_name: 'Conference Room A',
          estimated_cost: 100.00,
          parts_needed: 'LED Bulbs, Light Switch',
          work_notes: 'Check electrical connections and replace bulbs',
          reported_by: 'Event Staff',
          status: 'pending'
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(maintenanceData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Maintenance Requests');

      // Add instructions sheet
      const instructions = [
        { instruction: 'Hotel Management System - Maintenance Requests Import Template' },
        { instruction: '' },
        { instruction: 'CATEGORIES:' },
        { instruction: 'electrical, plumbing, hvac, furniture, appliance, structural, safety, other' },
        { instruction: '' },
        { instruction: 'PRIORITY LEVELS:' },
        { instruction: 'low, medium, high, urgent' },
        { instruction: '' },
        { instruction: 'STATUS OPTIONS:' },
        { instruction: 'pending, assigned, in_progress, completed, cancelled' },
        { instruction: '' },
        { instruction: 'REQUIRED FIELDS:' },
        { instruction: 'title*, description*, category*, priority*, location*' },
        { instruction: '' },
        { instruction: 'OPTIONAL FIELDS:' },
        { instruction: 'room_number, hall_name, estimated_cost, parts_needed, work_notes' },
        { instruction: '' },
        { instruction: 'IMPORT INSTRUCTIONS:' },
        { instruction: '1. Fill in your maintenance data following the sample format' },
        { instruction: '2. Use either room_number OR hall_name for location reference' },
        { instruction: '3. Save as .xlsx format' },
        { instruction: '4. Use Maintenance > Import function' },
        { instruction: '' },
        { instruction: 'SUPPORT: support@hotelmanagementsystem.com' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Import Instructions');

      return workbook;
    } catch (error) {
      console.error('Error generating maintenance template:', error);
      throw error;
    }
  };

  const generateRecipesTemplate = async () => {
    try {
      const recipesData = [
        {
          name: 'Grilled Salmon with Herb Butter',
          description: 'Perfect grilled salmon with aromatic herb butter sauce',
          instructions: '1. Season salmon with salt and pepper\n2. Preheat grill to medium-high\n3. Grill salmon 6-8 minutes per side\n4. Prepare herb butter with parsley, dill, and lemon\n5. Serve immediately with vegetables',
          prep_time_minutes: 15,
          cooking_time_minutes: 20,
          servings: 4,
          difficulty_level: 'medium',
          ingredients: 'Salmon fillet:4:pieces:6oz each|Butter:0.1:kg:room temperature|Fresh Herbs:2:bunches:parsley and dill|Lemons:2:pieces:for juice',
          nutritional_calories: 450,
          nutritional_protein: 35,
          nutritional_carbs: 2,
          nutritional_fat: 32,
          chef_notes: 'Do not overcook the salmon. Internal temperature should reach 145°F.'
        },
        {
          name: 'Classic Mojito',
          description: 'Refreshing Cuban cocktail with mint and lime',
          instructions: '1. Muddle mint leaves gently in glass\n2. Add lime juice and simple syrup\n3. Fill glass with ice\n4. Add white rum\n5. Top with soda water\n6. Garnish with mint sprig',
          prep_time_minutes: 5,
          cooking_time_minutes: 0,
          servings: 1,
          difficulty_level: 'easy',
          ingredients: 'White rum:60:ml:premium quality|Mint Leaves:1:bunches:plus extra for garnish|Lime Juice:30:ml:freshly squeezed|Simple Syrup:15:ml:adjust to taste|Soda Water:100:ml:chilled',
          chef_notes: 'Muddle mint gently to avoid bitterness. Use plenty of ice.'
        },
        {
          name: 'Chocolate Lava Cake',
          description: 'Decadent warm chocolate cake with molten center',
          instructions: '1. Preheat oven to 425°F\n2. Melt chocolate and butter in double boiler\n3. Whisk in eggs and sugar\n4. Fold in flour\n5. Pour into ramekins\n6. Bake for 12-14 minutes\n7. Serve immediately',
          prep_time_minutes: 20,
          cooking_time_minutes: 15,
          servings: 4,
          difficulty_level: 'medium',
          ingredients: 'Dark Chocolate:0.2:kg:high quality|Butter:0.1:kg:unsalted|Eggs:4:pieces:room temperature|Sugar:0.1:kg:granulated|Flour:0.05:kg:all-purpose',
          nutritional_calories: 520,
          nutritional_protein: 8,
          nutritional_carbs: 45,
          nutritional_fat: 35,
          chef_notes: 'The key is timing - do not overbake or the center will not be molten.'
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(recipesData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Recipes');

      // Add halls data
      const hallsData = [
        {
          hall_name: 'Grand Ballroom',
          hall_type: 'ballroom',
          capacity: 300,
          hourly_rate: 200.00,
          daily_rate: 1500.00,
          amenities: 'Sound System, Projector, Stage, Dance Floor, Bar, Kitchen Access, Parking',
          description: 'Elegant ballroom perfect for weddings, galas, and large corporate events',
          is_available: true
        }
      ];
      const hallsSheet = XLSX.utils.json_to_sheet(hallsData);
      XLSX.utils.book_append_sheet(workbook, hallsSheet, 'Event Halls');

      // Add instructions sheet
      const instructions = [
        { instruction: 'Hotel Management System - Recipes & Kitchen Import Template' },
        { instruction: '' },
        { instruction: 'DIFFICULTY LEVELS:' },
        { instruction: 'easy, medium, hard' },
        { instruction: '' },
        { instruction: 'INGREDIENTS FORMAT:' },
        { instruction: 'Use format: Name:Quantity:Unit:Notes separated by | (pipe)' },
        { instruction: 'Example: Salmon fillet:4:pieces:6oz each|Butter:0.1:kg:room temperature' },
        { instruction: '' },
        { instruction: 'INSTRUCTIONS:' },
        { instruction: 'Use \\n for line breaks in step-by-step instructions' },
        { instruction: '' },
        { instruction: 'REQUIRED FIELDS:' },
        { instruction: 'name*, description*, instructions*, prep_time_minutes*, cooking_time_minutes*, servings*, difficulty_level*' },
        { instruction: '' },
        { instruction: 'IMPORT INSTRUCTIONS:' },
        { instruction: '1. Fill in your recipe data following the sample format' },
        { instruction: '2. Use proper ingredients format with pipe separators' },
        { instruction: '3. Save as .xlsx format' },
        { instruction: '4. Use Recipes > Import function' },
        { instruction: '' },
        { instruction: 'SUPPORT: support@hotelmanagementsystem.com' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Import Instructions');

      return workbook;
    } catch (error) {
      console.error('Error generating recipes template:', error);
      throw error;
    }
  };

  const generateAccountingTemplate = async () => {
    try {
      const transactionsData = [
        {
          transaction_number: 'TXN-2024-001',
          type: 'income',
          category: 'room_revenue',
          subcategory: 'standard_room',
          amount: 540.00,
          description: 'Room booking payment - John Smith',
          reference_id: 'booking-001',
          payment_method: 'card',
          account: 'Room Revenue',
          tax_amount: 43.20,
          receipt_number: 'RCP-001',
          transaction_date: '2024-01-15',
          processed_by: 'Front Desk'
        },
        {
          transaction_number: 'TXN-2024-002',
          type: 'income',
          category: 'food_beverage',
          subcategory: 'restaurant',
          amount: 85.50,
          description: 'Restaurant order - Table 5',
          reference_id: 'order-001',
          payment_method: 'cash',
          account: 'Restaurant Revenue',
          tax_amount: 6.84,
          receipt_number: 'RCP-002',
          transaction_date: '2024-01-15',
          processed_by: 'Kitchen Staff'
        },
        {
          transaction_number: 'TXN-2024-003',
          type: 'expense',
          category: 'supplies',
          subcategory: 'food_supplies',
          amount: 450.00,
          description: 'Fresh seafood delivery',
          payment_method: 'bank_transfer',
          account: 'Food Supplies',
          transaction_date: '2024-01-15',
          processed_by: 'Store Keeper',
          approved_by: 'Manager'
        },
        {
          transaction_number: 'TXN-2024-004',
          type: 'expense',
          category: 'utilities',
          subcategory: 'electricity',
          amount: 2500.00,
          description: 'Monthly electricity bill',
          payment_method: 'bank_transfer',
          account: 'Utilities',
          transaction_date: '2024-01-15',
          processed_by: 'Accountant',
          approved_by: 'Manager'
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(transactionsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Financial Transactions');

      // Add instructions sheet
      const instructions = [
        { instruction: 'Hotel Management System - Financial Transactions Import Template' },
        { instruction: '' },
        { instruction: 'TRANSACTION TYPES:' },
        { instruction: 'income, expense' },
        { instruction: '' },
        { instruction: 'INCOME CATEGORIES:' },
        { instruction: 'room_revenue, hall_revenue, food_beverage, other_revenue' },
        { instruction: '' },
        { instruction: 'EXPENSE CATEGORIES:' },
        { instruction: 'utilities, supplies, maintenance, salaries, marketing, other_expense' },
        { instruction: '' },
        { instruction: 'PAYMENT METHODS:' },
        { instruction: 'cash, card, bank_transfer, mobile_money, check' },
        { instruction: '' },
        { instruction: 'DATE FORMAT:' },
        { instruction: 'Use YYYY-MM-DD format for transaction_date' },
        { instruction: '' },
        { instruction: 'REQUIRED FIELDS:' },
        { instruction: 'transaction_number*, type*, category*, amount*, description*, transaction_date*, processed_by*' },
        { instruction: '' },
        { instruction: 'IMPORT INSTRUCTIONS:' },
        { instruction: '1. Fill in your transaction data following the sample format' },
        { instruction: '2. Ensure transaction numbers are unique' },
        { instruction: '3. Save as .xlsx format' },
        { instruction: '4. Use Accounting > Import function' },
        { instruction: '' },
        { instruction: 'SUPPORT: support@hotelmanagementsystem.com' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Import Instructions');

      return workbook;
    } catch (error) {
      console.error('Error generating accounting template:', error);
      throw error;
    }
  };

  const generateCompleteTemplate = async () => {
    try {
      const workbook = XLSX.utils.book_new();

      // Add all individual templates as separate sheets
      const menuWorkbook = await generateMenuTemplate();
      const menuSheet = menuWorkbook.Sheets['Menu Items'];
      XLSX.utils.book_append_sheet(workbook, menuSheet, '1. Menu Items');

      const inventoryWorkbook = await generateInventoryTemplate();
      const inventorySheet = inventoryWorkbook.Sheets['Inventory Items'];
      XLSX.utils.book_append_sheet(workbook, inventorySheet, '2. Inventory Items');

      const roomsWorkbook = await generateRoomsTemplate();
      const roomsSheet = roomsWorkbook.Sheets['Hotel Rooms'];
      XLSX.utils.book_append_sheet(workbook, roomsSheet, '3. Hotel Rooms');

      const bookingsWorkbook = await generateBookingsTemplate();
      const bookingsSheet = bookingsWorkbook.Sheets['Guest Bookings'];
      XLSX.utils.book_append_sheet(workbook, bookingsSheet, '4. Guest Bookings');

      const hallsWorkbook = await generateHallsTemplate();
      const hallsSheet = hallsWorkbook.Sheets['Event Halls'];
      const hallBookingsSheet = hallsWorkbook.Sheets['Hall Bookings'];
      XLSX.utils.book_append_sheet(workbook, hallsSheet, '5. Event Halls');
      XLSX.utils.book_append_sheet(workbook, hallBookingsSheet, '6. Hall Bookings');

      const staffWorkbook = await generateStaffTemplate();
      const staffSheet = staffWorkbook.Sheets['Staff Members'];
      XLSX.utils.book_append_sheet(workbook, staffSheet, '7. Staff Members');

      const maintenanceWorkbook = await generateMaintenanceTemplate();
      const maintenanceSheet = maintenanceWorkbook.Sheets['Maintenance Requests'];
      XLSX.utils.book_append_sheet(workbook, maintenanceSheet, '8. Maintenance Requests');

      const recipesWorkbook = await generateRecipesTemplate();
      const recipesSheet = recipesWorkbook.Sheets['Recipes'];
      XLSX.utils.book_append_sheet(workbook, recipesSheet, '9. Recipes');

      const accountingWorkbook = await generateAccountingTemplate();
      const accountingSheet = accountingWorkbook.Sheets['Financial Transactions'];
      XLSX.utils.book_append_sheet(workbook, accountingSheet, '10. Financial Transactions');

      // Add comprehensive instructions
      const instructions = [
        { instruction: 'Hotel Management System - Complete Import Template' },
        { instruction: 'Version 1.0 - All Data Types Included' },
        { instruction: '' },
        { instruction: 'TEMPLATE CONTENTS:' },
        { instruction: '1. Menu Items - Restaurant and bar menu items' },
        { instruction: '2. Inventory Items - Kitchen, bar, and hotel supplies' },
        { instruction: '3. Hotel Rooms - Room types, pricing, and amenities' },
        { instruction: '4. Guest Bookings - Room reservations and guest data' },
        { instruction: '5. Event Halls - Meeting rooms and event spaces' },
        { instruction: '6. Hall Bookings - Event reservations and client data' },
        { instruction: '7. Staff Members - Employee data and roles' },
        { instruction: '8. Maintenance Requests - Facility maintenance tracking' },
        { instruction: '9. Recipes - Kitchen recipes and cooking instructions' },
        { instruction: '10. Financial Transactions - Income and expense tracking' },
        { instruction: '' },
        { instruction: 'IMPORT ORDER RECOMMENDATION:' },
        { instruction: '1. Import Rooms first (required for bookings)' },
        { instruction: '2. Import Event Halls (required for hall bookings)' },
        { instruction: '3. Import Staff Members (required for assignments)' },
        { instruction: '4. Import Menu Items and Inventory' },
        { instruction: '5. Import Recipes (links to menu items)' },
        { instruction: '6. Import Bookings and Hall Bookings' },
        { instruction: '7. Import Maintenance Requests' },
        { instruction: '8. Import Financial Transactions' },
        { instruction: '' },
        { instruction: 'GENERAL IMPORT INSTRUCTIONS:' },
        { instruction: '1. Each sheet can be imported separately using the respective module' },
        { instruction: '2. Keep column headers exactly as shown in each sheet' },
        { instruction: '3. Follow the sample data format for each data type' },
        { instruction: '4. Save as .xlsx format before importing' },
        { instruction: '5. Import sheets in the recommended order above' },
        { instruction: '6. Verify data after each import before proceeding' },
        { instruction: '' },
        { instruction: 'DATA VALIDATION NOTES:' },
        { instruction: '• Required fields are marked with * in individual sheet instructions' },
        { instruction: '• Use exact category names as shown in samples' },
        { instruction: '• Date format: YYYY-MM-DD' },
        { instruction: '• DateTime format: YYYY-MM-DD HH:MM' },
        { instruction: '• Boolean fields: true/false' },
        { instruction: '• Numeric fields: Use decimal format (e.g., 12.99)' },
        { instruction: '• Email addresses must be unique across staff members' },
        { instruction: '• Room numbers must be unique' },
        { instruction: '• Transaction numbers must be unique' },
        { instruction: '' },
        { instruction: 'SUPPORT & DOCUMENTATION:' },
        { instruction: 'Email: support@hotelmanagementsystem.com' },
        { instruction: 'Phone: 1-800-HOTEL-HELP' },
        { instruction: 'Documentation: Available in system help section' },
        { instruction: 'Training: Video tutorials available in user manual' },
        { instruction: '' },
        { instruction: 'TROUBLESHOOTING:' },
        { instruction: '• If import fails, check required fields are filled' },
        { instruction: '• Verify data formats match examples exactly' },
        { instruction: '• Check for duplicate IDs or numbers' },
        { instruction: '• Contact support for complex import issues' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, '0. README - Start Here');

      return workbook;
    } catch (error) {
      console.error('Error generating complete template:', error);
      throw error;
    }
  };

  const downloadTemplate = async () => {
    try {
      console.log('🔄 Starting template download for:', templateType);
      
      let workbook;
      let filename;
      let description;

      switch (templateType) {
        case 'menu':
          console.log('📋 Generating menu template...');
          workbook = await generateMenuTemplate();
          filename = 'Hotel_Menu_Items_Template.xlsx';
          description = 'Menu items template with food, beverages, and recipes';
          break;
        case 'inventory':
          console.log('📦 Generating inventory template...');
          workbook = await generateInventoryTemplate();
          filename = 'Hotel_Inventory_Template.xlsx';
          description = 'Inventory template for kitchen, bar, and hotel supplies';
          break;
        case 'bookings':
          console.log('🏨 Generating bookings template...');
          workbook = await generateBookingsTemplate();
          filename = 'Hotel_Guest_Bookings_Template.xlsx';
          description = 'Guest reservations and booking management template';
          break;
        case 'rooms':
          console.log('🛏️ Generating rooms template...');
          workbook = await generateRoomsTemplate();
          filename = 'Hotel_Rooms_Setup_Template.xlsx';
          description = 'Hotel rooms configuration and pricing template';
          break;
        case 'halls':
          console.log('🏢 Generating halls template...');
          workbook = await generateHallsTemplate();
          filename = 'Hotel_Event_Halls_Template.xlsx';
          description = 'Event halls and bookings management template';
          break;
        case 'staff':
          console.log('👥 Generating staff template...');
          workbook = await generateStaffTemplate();
          filename = 'Hotel_Staff_Management_Template.xlsx';
          description = 'Staff members and role management template';
          break;
        case 'maintenance':
          console.log('🔧 Generating maintenance template...');
          workbook = await generateMaintenanceTemplate();
          filename = 'Hotel_Maintenance_Requests_Template.xlsx';
          description = 'Maintenance requests and facility management template';
          break;
        case 'recipes':
          console.log('📖 Generating recipes template...');
          workbook = await generateRecipesTemplate();
          filename = 'Hotel_Kitchen_Recipes_Template.xlsx';
          description = 'Kitchen recipes and cooking instructions template';
          break;
        case 'bar':
          console.log('🍷 Generating bar template...');
          workbook = await generateMenuTemplate(); // Use menu template for bar items
          filename = 'Hotel_Bar_Menu_Template.xlsx';
          description = 'Bar menu items, cocktails, and beverages template';
          break;
        case 'restaurant':
          console.log('🍽️ Generating restaurant template...');
          workbook = await generateMenuTemplate(); // Use menu template for restaurant items
          filename = 'Hotel_Restaurant_Menu_Template.xlsx';
          description = 'Restaurant menu items and food service template';
          break;
        case 'pool':
          console.log('🏊 Generating pool template...');
          workbook = await generateMenuTemplate(); // Use menu template for pool bar items
          filename = 'Hotel_Pool_Bar_Template.xlsx';
          description = 'Pool bar menu and poolside service template';
          break;
        case 'accounting':
          console.log('💰 Generating accounting template...');
          workbook = await generateAccountingTemplate();
          filename = 'Hotel_Financial_Transactions_Template.xlsx';
          description = 'Financial transactions and accounting template';
          break;
        case 'analytics':
          console.log('📊 Generating analytics template...');
          workbook = await generateCompleteTemplate();
          filename = 'Hotel_Analytics_Data_Template.xlsx';
          description = 'Complete data template for analytics and reporting';
          break;
        case 'all':
          console.log('📊 Generating complete template...');
          workbook = await generateCompleteTemplate();
          filename = 'Hotel_Management_Complete_System_Template.xlsx';
          description = 'Complete hotel management system template with all data types';
          break;
        default:
          throw new Error('Invalid template type');
      }

      console.log('✅ Template generated, converting to binary...');
      
      // Convert workbook to binary
      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      
      console.log('💾 Writing file to device storage...');
      
      // Create file URI
      const fileUri = FileSystem.documentDirectory + filename;
      
      // Write file
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('📤 File written, attempting to share...');
      console.log('File URI:', fileUri);
      
      // Share file
      if (await Sharing.isAvailableAsync()) {
        console.log('📱 Sharing is available, opening share dialog...');
        try {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: `Download ${filename}`,
            UTI: 'com.microsoft.excel.xlsx',
          });
        } catch (shareError) {
          console.log('Share error, showing file location instead:', shareError);
          Alert.alert(
            'Download Complete',
            `Template saved successfully!\n\nFile: ${filename}\nLocation: ${fileUri}\n\nYou can find it in your device's Downloads folder.`
          );
        }
        console.log('✅ Share dialog opened successfully');
      } else {
        console.log('⚠️ Sharing not available, showing file location');
        Alert.alert(
          'Download Complete',
          `Template saved successfully!\n\nFile: ${filename}\nLocation: ${fileUri}\n\nYou can find it in your device's Downloads folder or share it using your device's sharing options.`
        );
      }

      if (onDownloadComplete) {
        onDownloadComplete();
      }

      console.log('🎉 Template download completed successfully');
      
      Alert.alert(
        'Template Downloaded Successfully!',
        `✅ ${filename}\n\n📝 ${description}\n\n🔧 Next steps:\n1. Open the file in Excel or Google Sheets\n2. Replace sample data with your actual data\n3. Keep column headers exactly as shown\n4. Save and use the Import function\n\n💡 The template includes sample data and detailed instructions to guide you through the import process.`
      );

    } catch (error) {
      console.error('Error downloading template:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        templateType,
      });
      Alert.alert(
        'Download Error',
        `❌ Failed to download template.\n\nError: ${error.message || 'Unknown error'}\n\nPlease try again or contact support if the issue persists.`
      );
    }
  };

  const getTemplateInfo = () => {
    switch (templateType) {
      case 'menu':
        return {
          title: 'Menu Items Template',
          description: 'Restaurant & bar menu items with pricing and ingredients',
          icon: ChefHat,
          color: ['#10b981', '#059669'],
        };
      case 'inventory':
        return {
          title: 'Inventory Template',
          description: 'Kitchen, bar & hotel supplies inventory management',
          icon: Package,
          color: ['#7c3aed', '#6d28d9'],
        };
      case 'bookings':
        return {
          title: 'Guest Bookings Template',
          description: 'Guest reservations and room booking management',
          icon: Calendar,
          color: ['#2563eb', '#1e40af'],
        };
      case 'rooms':
        return {
          title: 'Hotel Rooms Template',
          description: 'Room setup, pricing, and amenities configuration',
          icon: Bed,
          color: ['#059669', '#047857'],
        };
      case 'halls':
        return {
          title: 'Event Halls Template',
          description: 'Event spaces and hall booking management',
          icon: Building,
          color: ['#7c3aed', '#6d28d9'],
        };
      case 'staff':
        return {
          title: 'Staff Management Template',
          description: 'Employee data, roles, and team management',
          icon: Users,
          color: ['#dc2626', '#b91c1c'],
        };
      case 'maintenance':
        return {
          title: 'Maintenance Requests Template',
          description: 'Facility maintenance and repair tracking',
          icon: Wrench,
          color: ['#ea580c', '#c2410c'],
        };
      case 'recipes':
        return {
          title: 'Kitchen Recipes Template',
          description: 'Cooking recipes and kitchen instructions',
          icon: BookOpen,
          color: ['#16a34a', '#15803d'],
        };
      case 'bar':
        return {
          title: 'Bar Menu Template',
          description: 'Bar menu items, cocktails, and beverage service',
          icon: Wine,
          color: ['#7c3aed', '#6d28d9'],
        };
      case 'restaurant':
        return {
          title: 'Restaurant Menu Template',
          description: 'Restaurant menu items and food service',
          icon: ChefHat,
          color: ['#059669', '#047857'],
        };
      case 'pool':
        return {
          title: 'Pool Bar Template',
          description: 'Pool bar menu and poolside service items',
          icon: Waves,
          color: ['#0ea5e9', '#0284c7'],
        };
      case 'accounting':
        return {
          title: 'Financial Transactions Template',
          description: 'Income, expenses, and financial data tracking',
          icon: Calculator,
          color: ['#16a34a', '#15803d'],
        };
      case 'analytics':
        return {
          title: 'Analytics Data Template',
          description: 'Complete data template for analytics and reporting',
          icon: FileSpreadsheet,
          color: ['#1e3a8a', '#1e40af'],
        };
      case 'all':
        return {
          title: 'Complete System Template',
          description: 'All hotel management data types in one comprehensive file',
          icon: FileSpreadsheet,
          color: ['#dc2626', '#b91c1c'],
        };
      default:
        return {
          title: 'Excel Template',
          description: 'Download Excel template for data import',
          icon: FileSpreadsheet,
          color: ['#64748b', '#475569'],
        };
    }
  };

  const templateInfo = getTemplateInfo();
  const Icon = templateInfo.icon;

  return (
    <TouchableOpacity style={styles.container} onPress={downloadTemplate}>
      <LinearGradient
        colors={templateInfo.color}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <Icon size={24} color="white" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{templateInfo.title}</Text>
          <Text style={styles.description}>{templateInfo.description}</Text>
        </View>
        <View style={styles.downloadIcon}>
          <Download size={20} color="white" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
  },
  downloadIcon: {
    padding: 8,
  },
});