import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Download, FileSpreadsheet, ChefHat, Wine, Package, Utensils } from 'lucide-react-native';

interface ExcelTemplateGeneratorProps {
  onDownload: (templateType: 'menu' | 'inventory' | 'complete') => void;
}

export function ExcelTemplateGenerator({ onDownload }: ExcelTemplateGeneratorProps) {
  const generateMenuTemplate = () => {
    const menuTemplate = {
      name: 'Menu_Items_Template.xlsx',
      description: 'Complete template for importing menu items',
      sheets: {
        'Food Items': {
          columns: [
            'name', 'description', 'category', 'subcategory', 'price', 'cost_price',
            'ingredients', 'allergens', 'prep_time_minutes', 'cooking_time_minutes',
            'difficulty_level', 'is_vegetarian', 'is_vegan', 'is_gluten_free', 'calories'
          ],
          sampleData: [
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
            }
          ]
        },
        'Beverages': {
          columns: [
            'name', 'description', 'category', 'subcategory', 'price', 'cost_price',
            'ingredients', 'prep_time_minutes', 'difficulty_level', 'is_vegetarian', 'is_vegan', 'is_gluten_free'
          ],
          sampleData: [
            {
              name: 'Classic Mojito',
              description: 'Refreshing Cuban cocktail with mint and lime',
              category: 'cocktail',
              subcategory: 'rum_based',
              price: 12.00,
              cost_price: 4.50,
              ingredients: 'white rum, mint leaves, lime juice, sugar, soda water',
              prep_time_minutes: 5,
              difficulty_level: 'easy',
              is_vegetarian: true,
              is_vegan: true,
              is_gluten_free: true
            },
            {
              name: 'Cabernet Sauvignon',
              description: 'Full-bodied red wine from Napa Valley',
              category: 'wine',
              subcategory: 'red_wine',
              price: 15.00,
              cost_price: 8.00,
              ingredients: 'cabernet sauvignon grapes',
              prep_time_minutes: 2,
              difficulty_level: 'easy',
              is_vegetarian: true,
              is_vegan: true,
              is_gluten_free: true
            }
          ]
        }
      }
    };

    Alert.alert(
      'Menu Template Download',
      `Template: ${menuTemplate.name}\n\n${menuTemplate.description}\n\nSheets included:\n• Food Items (${menuTemplate.sheets['Food Items'].columns.length} columns)\n• Beverages (${menuTemplate.sheets['Beverages'].columns.length} columns)\n\nIn a real implementation, this would download an Excel file with these sheets and sample data.`,
      [{ text: 'OK' }]
    );
  };

  const generateInventoryTemplate = () => {
    const inventoryTemplate = {
      name: 'Inventory_Template.xlsx',
      description: 'Complete template for importing inventory items',
      sheets: {
        'Kitchen Inventory': {
          columns: [
            'item_name', 'category', 'subcategory', 'current_stock', 'minimum_stock',
            'maximum_stock', 'unit', 'unit_cost', 'supplier', 'supplier_contact',
            'storage_location', 'expiry_date', 'is_perishable', 'barcode'
          ],
          sampleData: [
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
              item_name: 'Romaine Lettuce',
              category: 'food',
              subcategory: 'vegetables',
              current_stock: 50,
              minimum_stock: 20,
              maximum_stock: 100,
              unit: 'heads',
              unit_cost: 2.99,
              supplier: 'Fresh Farms Supply',
              supplier_contact: '+1-555-0103',
              storage_location: 'Walk-in Cooler',
              expiry_date: '2024-01-20',
              is_perishable: true,
              barcode: '2345678901234'
            }
          ]
        },
        'Bar Inventory': {
          columns: [
            'item_name', 'category', 'subcategory', 'current_stock', 'minimum_stock',
            'maximum_stock', 'unit', 'unit_cost', 'supplier', 'supplier_contact',
            'storage_location', 'expiry_date', 'is_perishable', 'barcode'
          ],
          sampleData: [
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
              item_name: 'Mint Leaves',
              category: 'food',
              subcategory: 'herbs',
              current_stock: 25,
              minimum_stock: 10,
              maximum_stock: 50,
              unit: 'bunches',
              unit_cost: 2.50,
              supplier: 'Fresh Farms Supply',
              supplier_contact: '+1-555-0103',
              storage_location: 'Bar Cooler',
              expiry_date: '2024-01-18',
              is_perishable: true,
              barcode: '3456789012345'
            }
          ]
        }
      }
    };

    Alert.alert(
      'Inventory Template Download',
      `Template: ${inventoryTemplate.name}\n\n${inventoryTemplate.description}\n\nSheets included:\n• Kitchen Inventory (${inventoryTemplate.sheets['Kitchen Inventory'].columns.length} columns)\n• Bar Inventory (${inventoryTemplate.sheets['Bar Inventory'].columns.length} columns)\n\nIn a real implementation, this would download an Excel file with these sheets and sample data.`,
      [{ text: 'OK' }]
    );
  };

  const generateCompleteTemplate = () => {
    Alert.alert(
      'Complete Template Download',
      'This would download a comprehensive Excel file with multiple sheets:\n\n• Menu Items (Foods)\n• Beverages (Drinks)\n• Kitchen Inventory\n• Bar Inventory\n• Categories Reference\n\nEach sheet would have proper column headers and sample data to guide the import process.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FileSpreadsheet size={24} color="#1e3a8a" />
        <Text style={styles.title}>Excel Templates</Text>
      </View>
      
      <Text style={styles.description}>
        Download pre-formatted Excel templates to easily import your data. Each template includes sample data and proper column formatting.
      </Text>

      <View style={styles.templatesGrid}>
        {/* Menu Template */}
        <TouchableOpacity style={styles.templateCard} onPress={generateMenuTemplate}>
          <LinearGradient
            colors={['#dcfce7', '#bbf7d0']}
            style={styles.templateGradient}
          >
            <View style={styles.templateIcon}>
              <ChefHat size={32} color="#16a34a" />
            </View>
            <Text style={styles.templateTitle}>Menu Items</Text>
            <Text style={styles.templateDescription}>
              Import foods, drinks, and beverages with pricing, ingredients, and dietary information
            </Text>
            <View style={styles.templateFeatures}>
              <Text style={styles.featureText}>• Food items & recipes</Text>
              <Text style={styles.featureText}>• Beverages & cocktails</Text>
              <Text style={styles.featureText}>• Pricing & cost data</Text>
              <Text style={styles.featureText}>• Dietary restrictions</Text>
            </View>
            <View style={styles.downloadIcon}>
              <Download size={16} color="#16a34a" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Inventory Template */}
        <TouchableOpacity style={styles.templateCard} onPress={generateInventoryTemplate}>
          <LinearGradient
            colors={['#e0e7ff', '#c7d2fe']}
            style={styles.templateGradient}
          >
            <View style={styles.templateIcon}>
              <Package size={32} color="#7c3aed" />
            </View>
            <Text style={styles.templateTitle}>Inventory Items</Text>
            <Text style={styles.templateDescription}>
              Import kitchen and bar inventory with stock levels, suppliers, and storage locations
            </Text>
            <View style={styles.templateFeatures}>
              <Text style={styles.featureText}>• Kitchen ingredients</Text>
              <Text style={styles.featureText}>• Bar supplies</Text>
              <Text style={styles.featureText}>• Stock levels & costs</Text>
              <Text style={styles.featureText}>• Supplier information</Text>
            </View>
            <View style={styles.downloadIcon}>
              <Download size={16} color="#7c3aed" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Complete Template */}
        <TouchableOpacity style={styles.templateCard} onPress={generateCompleteTemplate}>
          <LinearGradient
            colors={['#fef3c7', '#fde68a']}
            style={styles.templateGradient}
          >
            <View style={styles.templateIcon}>
              <FileSpreadsheet size={32} color="#d97706" />
            </View>
            <Text style={styles.templateTitle}>Complete System</Text>
            <Text style={styles.templateDescription}>
              Import everything at once with a comprehensive template including all data types
            </Text>
            <View style={styles.templateFeatures}>
              <Text style={styles.featureText}>• All menu items</Text>
              <Text style={styles.featureText}>• All inventory</Text>
              <Text style={styles.featureText}>• Multiple sheets</Text>
              <Text style={styles.featureText}>• Complete setup</Text>
            </View>
            <View style={styles.downloadIcon}>
              <Download size={16} color="#d97706" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.instructionsSection}>
        <Text style={styles.instructionsTitle}>📋 Import Instructions</Text>
        <View style={styles.instructionsList}>
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>Download the appropriate template above</Text>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>Open the template in Excel or Google Sheets</Text>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>Replace sample data with your actual data</Text>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.instructionText}>Keep column headers exactly as shown</Text>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>5</Text>
            </View>
            <Text style={styles.instructionText}>Save as .xlsx or .xls format</Text>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>6</Text>
            </View>
            <Text style={styles.instructionText}>Use the import button in the respective section</Text>
          </View>
        </View>
      </View>

      <View style={styles.categoriesReference}>
        <Text style={styles.referenceTitle}>📚 Valid Categories Reference</Text>
        
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Menu Categories:</Text>
          <View style={styles.categoryTags}>
            {['appetizer', 'main_course', 'dessert', 'beverage', 'wine', 'beer', 'cocktail', 'spirits', 'coffee', 'tea', 'juice', 'water'].map((cat) => (
              <View key={cat} style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Inventory Categories:</Text>
          <View style={styles.categoryTags}>
            {['food', 'beverage', 'alcohol', 'amenity', 'cleaning', 'maintenance', 'office', 'kitchen_equipment', 'bar_equipment'].map((cat) => (
              <View key={cat} style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Difficulty Levels:</Text>
          <View style={styles.categoryTags}>
            {['easy', 'medium', 'hard'].map((level) => (
              <View key={level} style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{level}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 20,
  },
  templatesGrid: {
    gap: 16,
    marginBottom: 32,
  },
  templateCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  templateGradient: {
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  templateIcon: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  templateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  templateDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  templateFeatures: {
    gap: 4,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  downloadIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  instructionsSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#1e3a8a',
  },
  instructionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  instructionsList: {
    gap: 12,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  categoriesReference: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#7c3aed',
  },
  referenceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  categoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryTag: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryTagText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#475569',
  },
});