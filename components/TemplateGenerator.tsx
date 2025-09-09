import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Download, FileSpreadsheet } from 'lucide-react-native';

interface TemplateGeneratorProps {
  onDownload: (templateType: 'menu' | 'inventory') => void;
}

export function TemplateGenerator({ onDownload }: TemplateGeneratorProps) {
  const generateMenuTemplate = () => {
    const menuTemplate = {
      headers: [
        'name', 'description', 'category', 'subcategory', 'price', 'cost_price',
        'ingredients', 'allergens', 'prep_time_minutes', 'cooking_time_minutes',
        'difficulty_level', 'is_vegetarian', 'is_vegan', 'is_gluten_free', 'calories'
      ],
      sampleData: [
        {
          name: 'Grilled Chicken Breast',
          description: 'Tender grilled chicken with herbs',
          category: 'main_course',
          subcategory: 'chicken',
          price: 24.99,
          cost_price: 12.50,
          ingredients: 'chicken breast, herbs, olive oil, salt, pepper',
          allergens: '',
          prep_time_minutes: 15,
          cooking_time_minutes: 20,
          difficulty_level: 'medium',
          is_vegetarian: false,
          is_vegan: false,
          is_gluten_free: true,
          calories: 350
        },
        {
          name: 'Classic Mojito',
          description: 'Refreshing mint and lime cocktail',
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
      ]
    };

    Alert.alert(
      'Menu Template',
      `Template would include columns:\n${menuTemplate.headers.join(', ')}\n\nWith sample data for reference.`,
      [{ text: 'OK' }]
    );
  };

  const generateInventoryTemplate = () => {
    const inventoryTemplate = {
      headers: [
        'item_name', 'category', 'subcategory', 'current_stock', 'minimum_stock',
        'maximum_stock', 'unit', 'unit_cost', 'supplier', 'supplier_contact',
        'storage_location', 'expiry_date', 'is_perishable', 'barcode'
      ],
      sampleData: [
        {
          item_name: 'Chicken Breast',
          category: 'food',
          subcategory: 'meat',
          current_stock: 50,
          minimum_stock: 20,
          maximum_stock: 100,
          unit: 'kg',
          unit_cost: 8.99,
          supplier: 'Fresh Meat Co',
          supplier_contact: '+1-555-0123',
          storage_location: 'Walk-in Freezer',
          expiry_date: '2024-02-15',
          is_perishable: true,
          barcode: '1234567890'
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
          supplier: 'Premium Spirits',
          supplier_contact: '+1-555-0456',
          storage_location: 'Bar Storage',
          expiry_date: '',
          is_perishable: false,
          barcode: '9876543210'
        }
      ]
    };

    Alert.alert(
      'Inventory Template',
      `Template would include columns:\n${inventoryTemplate.headers.join(', ')}\n\nWith sample data for reference.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Excel Templates</Text>
      <Text style={styles.description}>
        Download templates to format your data correctly before importing.
      </Text>

      <View style={styles.templateButtons}>
        <TouchableOpacity style={styles.templateButton} onPress={generateMenuTemplate}>
          <FileSpreadsheet size={20} color="#1e3a8a" />
          <Text style={styles.templateButtonText}>Menu Template</Text>
          <Download size={16} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.templateButton} onPress={generateInventoryTemplate}>
          <FileSpreadsheet size={20} color="#7c3aed" />
          <Text style={styles.templateButtonText}>Inventory Template</Text>
          <Download size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View style={styles.instructionsSection}>
        <Text style={styles.instructionsTitle}>Import Instructions:</Text>
        <Text style={styles.instructionText}>1. Download the appropriate template</Text>
        <Text style={styles.instructionText}>2. Fill in your data following the sample format</Text>
        <Text style={styles.instructionText}>3. Save as .xlsx or .xls file</Text>
        <Text style={styles.instructionText}>4. Use the import button to upload your file</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  templateButtons: {
    gap: 12,
    marginBottom: 24,
  },
  templateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  templateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    flex: 1,
    marginLeft: 12,
  },
  instructionsSection: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1e3a8a',
  },
  instructionsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 4,
  },
});