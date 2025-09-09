import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet, ChefHat, Package, Building } from 'lucide-react-native';

interface ExcelTemplateDownloaderProps {
  templateType: 'menu' | 'inventory' | 'bookings' | 'all';
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
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(menuData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Menu Items');

      // Add instructions sheet
      const instructions = [
        { instruction: 'Menu Import Instructions' },
        { instruction: '' },
        { instruction: 'Valid Categories:' },
        { instruction: 'appetizer, main_course, dessert, beverage, wine, beer, cocktail, spirits, coffee, tea, juice, water' },
        { instruction: '' },
        { instruction: 'Difficulty Levels:' },
        { instruction: 'easy, medium, hard' },
        { instruction: '' },
        { instruction: 'Boolean Fields:' },
        { instruction: 'Use true/false for is_vegetarian, is_vegan, is_gluten_free' },
        { instruction: '' },
        { instruction: 'Ingredients:' },
        { instruction: 'Separate multiple ingredients with commas' },
        { instruction: '' },
        { instruction: 'Required Fields:' },
        { instruction: 'name, description, category, price, cost_price' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

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
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(inventoryData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Items');

      // Add instructions sheet
      const instructions = [
        { instruction: 'Inventory Import Instructions' },
        { instruction: '' },
        { instruction: 'Valid Categories:' },
        { instruction: 'food, beverage, alcohol, amenity, cleaning, maintenance, office, kitchen_equipment, bar_equipment' },
        { instruction: '' },
        { instruction: 'Units:' },
        { instruction: 'pieces, kg, liters, bottles, boxes, etc.' },
        { instruction: '' },
        { instruction: 'Date Format:' },
        { instruction: 'Use YYYY-MM-DD format for expiry_date' },
        { instruction: '' },
        { instruction: 'Boolean Fields:' },
        { instruction: 'Use true/false for is_perishable' },
        { instruction: '' },
        { instruction: 'Required Fields:' },
        { instruction: 'item_name, category, unit_cost, supplier' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

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
        }
      ];

      const worksheet = XLSX.utils.json_to_sheet(bookingsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');

      // Add instructions sheet
      const instructions = [
        { instruction: 'Bookings Import Instructions' },
        { instruction: '' },
        { instruction: 'Date Format:' },
        { instruction: 'Use YYYY-MM-DD format for check_in and check_out' },
        { instruction: '' },
        { instruction: 'Payment Status Options:' },
        { instruction: 'pending, partial, paid, refunded, overdue' },
        { instruction: '' },
        { instruction: 'Booking Status Options:' },
        { instruction: 'confirmed, checked_in, checked_out, cancelled, no_show' },
        { instruction: '' },
        { instruction: 'Required Fields:' },
        { instruction: 'guest_name, guest_email, room_number, check_in, check_out, adults, total_amount' },
        { instruction: '' },
        { instruction: 'Notes:' },
        { instruction: 'Room number must exist in the system' },
        { instruction: 'Check-out date must be after check-in date' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

      return workbook;
    } catch (error) {
      console.error('Error generating bookings template:', error);
      throw error;
    }
  };

  const generateCompleteTemplate = async () => {
    try {
      const workbook = XLSX.utils.book_new();

      // Add menu sheet
      const menuWorkbook = await generateMenuTemplate();
      const menuSheet = menuWorkbook.Sheets['Menu Items'];
      XLSX.utils.book_append_sheet(workbook, menuSheet, 'Menu Items');

      // Add inventory sheet
      const inventoryWorkbook = await generateInventoryTemplate();
      const inventorySheet = inventoryWorkbook.Sheets['Inventory Items'];
      XLSX.utils.book_append_sheet(workbook, inventorySheet, 'Inventory Items');

      // Add bookings sheet
      const bookingsWorkbook = await generateBookingsTemplate();
      const bookingsSheet = bookingsWorkbook.Sheets['Bookings'];
      XLSX.utils.book_append_sheet(workbook, bookingsSheet, 'Bookings');

      // Add comprehensive instructions
      const instructions = [
        { section: 'Hotel Management System - Complete Import Template' },
        { section: '' },
        { section: 'This template contains three sheets:' },
        { section: '1. Menu Items - Restaurant and bar menu items' },
        { section: '2. Inventory Items - Kitchen, bar, and hotel supplies' },
        { section: '3. Bookings - Guest reservations' },
        { section: '' },
        { section: 'Instructions:' },
        { section: '1. Fill in your data in the appropriate sheets' },
        { section: '2. Keep column headers exactly as shown' },
        { section: '3. Follow the sample data format' },
        { section: '4. Save as .xlsx format' },
        { section: '5. Import using the respective import functions' },
        { section: '' },
        { section: 'Support: support@hotelmanagementsystem.com' }
      ];
      
      const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'README');

      return workbook;
    } catch (error) {
      console.error('Error generating complete template:', error);
      throw error;
    }
  };

  const downloadTemplate = async () => {
    try {
      let workbook;
      let filename;

      switch (templateType) {
        case 'menu':
          workbook = await generateMenuTemplate();
          filename = 'Menu_Items_Template.xlsx';
          break;
        case 'inventory':
          workbook = await generateInventoryTemplate();
          filename = 'Inventory_Template.xlsx';
          break;
        case 'bookings':
          workbook = await generateBookingsTemplate();
          filename = 'Bookings_Template.xlsx';
          break;
        case 'all':
          workbook = await generateCompleteTemplate();
          filename = 'Hotel_Management_Complete_Template.xlsx';
          break;
        default:
          throw new Error('Invalid template type');
      }

      // Convert workbook to binary
      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      
      // Create file URI
      const fileUri = FileSystem.documentDirectory + filename;
      
      // Write file
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: `Download ${filename}`,
        });
      } else {
        Alert.alert(
          'Download Complete',
          `Template saved to: ${fileUri}\n\nYou can find it in your device's Downloads folder.`
        );
      }

      if (onDownloadComplete) {
        onDownloadComplete();
      }

      Alert.alert(
        'Template Downloaded',
        `${filename} has been downloaded successfully. You can now fill in your data and import it back into the system.`
      );

    } catch (error) {
      console.error('Error downloading template:', error);
      Alert.alert(
        'Download Error',
        'Failed to download template. Please try again or contact support.'
      );
    }
  };

  const getTemplateInfo = () => {
    switch (templateType) {
      case 'menu':
        return {
          title: 'Menu Items Template',
          description: 'Download template for importing restaurant and bar menu items',
          icon: ChefHat,
          color: ['#10b981', '#059669'],
        };
      case 'inventory':
        return {
          title: 'Inventory Template',
          description: 'Download template for importing kitchen and bar inventory',
          icon: Package,
          color: ['#7c3aed', '#6d28d9'],
        };
      case 'bookings':
        return {
          title: 'Bookings Template',
          description: 'Download template for importing guest reservations',
          icon: Building,
          color: ['#2563eb', '#1e40af'],
        };
      case 'all':
        return {
          title: 'Complete System Template',
          description: 'Download comprehensive template with all data types',
          icon: FileSpreadsheet,
          color: ['#dc2626', '#b91c1c'],
        };
      default:
        return {
          title: 'Excel Template',
          description: 'Download Excel template',
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