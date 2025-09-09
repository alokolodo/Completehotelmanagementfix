import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';
import { db } from '@/lib/database';
import { Database } from '@/types/database';
import { Upload, FileSpreadsheet, Download, CircleCheck as CheckCircle, CircleAlert as AlertCircle, FileText } from 'lucide-react-native';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type InventoryItem = Database['public']['Tables']['inventory']['Row'];

interface ExcelImporterProps {
  visible: boolean;
  onClose: () => void;
  importType: 'menu' | 'inventory' | 'all';
  onImportComplete: () => void;
}

export function ExcelImporter({ visible, onClose, importType, onImportComplete }: ExcelImporterProps) {
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
    type: string;
    details: string[];
  } | null>(null);

  const downloadTemplate = () => {
    const templates = {
      menu: {
        name: 'Menu_Template.xlsx',
        description: 'Template for importing menu items (foods and drinks)',
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
        ]
      },
      inventory: {
        name: 'Inventory_Template.xlsx',
        description: 'Template for importing inventory items (kitchen and bar)',
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
          }
        ]
      }
    };

    const template = templates[importType as keyof typeof templates];
    if (template) {
      Alert.alert(
        `${template.name}`,
        `${template.description}\n\nColumns: ${template.columns.join(', ')}\n\nIn a real implementation, this would download an Excel file with these columns and sample data.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Multiple Templates',
        'This would download both Menu and Inventory templates as separate sheets in one Excel file.',
        [{ text: 'OK' }]
      );
    }
  };

  const pickAndImportFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        await processExcelFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const processExcelFile = async (file: any) => {
    setImporting(true);
    setImportResults(null);

    try {
      // Read file content
      const response = await fetch(file.uri);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      let totalSuccess = 0;
      let allErrors: string[] = [];
      let details: string[] = [];

      // Process based on import type
      if (importType === 'menu' || importType === 'all') {
        const menuResult = await processMenuSheet(workbook);
        totalSuccess += menuResult.success;
        allErrors.push(...menuResult.errors);
        details.push(`Menu Items: ${menuResult.success} imported`);
      }

      if (importType === 'inventory' || importType === 'all') {
        const inventoryResult = await processInventorySheet(workbook);
        totalSuccess += inventoryResult.success;
        allErrors.push(...inventoryResult.errors);
        details.push(`Inventory Items: ${inventoryResult.success} imported`);
      }

      setImportResults({
        success: totalSuccess,
        errors: allErrors,
        type: importType,
        details,
      });

      if (totalSuccess > 0) {
        onImportComplete();
      }

    } catch (error) {
      console.error('Error processing Excel file:', error);
      Alert.alert('Error', 'Failed to process Excel file. Please check the format.');
    } finally {
      setImporting(false);
    }
  };

  const processMenuSheet = async (workbook: XLSX.WorkBook) => {
    // Look for menu sheet
    const sheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('menu') || 
      name.toLowerCase().includes('food') || 
      name.toLowerCase().includes('drink') ||
      name.toLowerCase().includes('beverage')
    ) || workbook.SheetNames[0];

    if (!sheetName) {
      return { success: 0, errors: ['No menu sheet found'] };
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    let success = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      try {
        const menuItem: any = data[i];
        const rowNumber = i + 2; // Excel row number (accounting for header)
        
        // Validate required fields
        if (!menuItem.name || !menuItem.description || !menuItem.category || !menuItem.price) {
          errors.push(`Row ${rowNumber}: Missing required fields (name, description, category, price)`);
          continue;
        }

        // Validate category
        const validCategories = ['appetizer', 'main_course', 'dessert', 'beverage', 'wine', 'beer', 'cocktail', 'spirits', 'coffee', 'tea', 'juice', 'water'];
        if (!validCategories.includes(menuItem.category.toLowerCase())) {
          errors.push(`Row ${rowNumber}: Invalid category '${menuItem.category}'. Must be one of: ${validCategories.join(', ')}`);
          continue;
        }

        // Parse ingredients if it's a string
        let ingredients = [];
        if (menuItem.ingredients) {
          if (typeof menuItem.ingredients === 'string') {
            ingredients = menuItem.ingredients.split(',').map((ing: string) => ing.trim()).filter(Boolean);
          } else if (Array.isArray(menuItem.ingredients)) {
            ingredients = menuItem.ingredients;
          }
        }

        // Parse allergens if it's a string
        let allergens = [];
        if (menuItem.allergens) {
          if (typeof menuItem.allergens === 'string') {
            allergens = menuItem.allergens.split(',').map((all: string) => all.trim()).filter(Boolean);
          } else if (Array.isArray(menuItem.allergens)) {
            allergens = menuItem.allergens;
          }
        }

        // Validate difficulty level
        const validDifficulties = ['easy', 'medium', 'hard'];
        const difficulty = menuItem.difficulty_level?.toLowerCase() || 'easy';
        if (!validDifficulties.includes(difficulty)) {
          errors.push(`Row ${rowNumber}: Invalid difficulty '${menuItem.difficulty_level}'. Must be: easy, medium, or hard`);
          continue;
        }

        const newMenuItem = {
          name: menuItem.name.trim(),
          description: menuItem.description.trim(),
          category: menuItem.category.toLowerCase(),
          subcategory: menuItem.subcategory?.trim() || '',
          price: parseFloat(menuItem.price) || 0,
          cost_price: parseFloat(menuItem.cost_price) || 0,
          ingredients,
          allergens,
          prep_time_minutes: parseInt(menuItem.prep_time_minutes) || 0,
          cooking_time_minutes: parseInt(menuItem.cooking_time_minutes) || 0,
          difficulty_level: difficulty,
          is_available: menuItem.is_available !== false && menuItem.is_available !== 'false',
          is_vegetarian: menuItem.is_vegetarian === true || menuItem.is_vegetarian === 'true',
          is_vegan: menuItem.is_vegan === true || menuItem.is_vegan === 'true',
          is_gluten_free: menuItem.is_gluten_free === true || menuItem.is_gluten_free === 'true',
          calories: parseInt(menuItem.calories) || 0,
        };

        await db.insert<MenuItem>('menu_items', newMenuItem);
        success++;
      } catch (error) {
        const rowNumber = i + 2;
        errors.push(`Row ${rowNumber}: Failed to import - ${error}`);
      }
    }

    return { success, errors };
  };

  const processInventorySheet = async (workbook: XLSX.WorkBook) => {
    // Look for inventory sheet
    const sheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('inventory') || 
      name.toLowerCase().includes('stock') || 
      name.toLowerCase().includes('store') ||
      name.toLowerCase().includes('kitchen') ||
      name.toLowerCase().includes('bar')
    ) || workbook.SheetNames[1] || workbook.SheetNames[0];

    if (!sheetName) {
      return { success: 0, errors: ['No inventory sheet found'] };
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    let success = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      try {
        const inventoryItem: any = data[i];
        const rowNumber = i + 2; // Excel row number (accounting for header)
        
        // Validate required fields
        if (!inventoryItem.item_name || !inventoryItem.category || !inventoryItem.unit_cost || !inventoryItem.supplier) {
          errors.push(`Row ${rowNumber}: Missing required fields (item_name, category, unit_cost, supplier)`);
          continue;
        }

        // Validate category
        const validCategories = ['food', 'beverage', 'alcohol', 'amenity', 'cleaning', 'maintenance', 'office', 'kitchen_equipment', 'bar_equipment'];
        if (!validCategories.includes(inventoryItem.category.toLowerCase())) {
          errors.push(`Row ${rowNumber}: Invalid category '${inventoryItem.category}'. Must be one of: ${validCategories.join(', ')}`);
          continue;
        }

        // Calculate total value
        const currentStock = parseInt(inventoryItem.current_stock) || 0;
        const unitCost = parseFloat(inventoryItem.unit_cost) || 0;
        const totalValue = currentStock * unitCost;

        // Parse expiry date
        let expiryDate = null;
        if (inventoryItem.expiry_date) {
          const date = new Date(inventoryItem.expiry_date);
          if (!isNaN(date.getTime())) {
            expiryDate = date.toISOString().split('T')[0];
          }
        }

        const newInventoryItem = {
          item_name: inventoryItem.item_name.trim(),
          category: inventoryItem.category.toLowerCase(),
          subcategory: inventoryItem.subcategory?.trim() || '',
          current_stock: currentStock,
          minimum_stock: parseInt(inventoryItem.minimum_stock) || 0,
          maximum_stock: parseInt(inventoryItem.maximum_stock) || 100,
          unit: inventoryItem.unit?.trim() || 'pieces',
          unit_cost: unitCost,
          total_value: totalValue,
          supplier: inventoryItem.supplier.trim(),
          supplier_contact: inventoryItem.supplier_contact?.trim() || '',
          storage_location: inventoryItem.storage_location?.trim() || 'General Storage',
          expiry_date: expiryDate,
          batch_number: inventoryItem.batch_number?.trim() || '',
          last_restocked: new Date().toISOString(),
          reorder_point: parseInt(inventoryItem.reorder_point) || parseInt(inventoryItem.minimum_stock) || 0,
          is_perishable: inventoryItem.is_perishable === true || inventoryItem.is_perishable === 'true',
          barcode: inventoryItem.barcode?.trim() || '',
        };

        await db.insert<InventoryItem>('inventory', newInventoryItem);
        success++;
      } catch (error) {
        const rowNumber = i + 2;
        errors.push(`Row ${rowNumber}: Failed to import - ${error}`);
      }
    }

    return { success, errors };
  };

  const getTemplateInfo = () => {
    switch (importType) {
      case 'menu':
        return {
          title: 'Menu Items Import',
          description: 'Import restaurant and bar menu items from Excel',
          icon: '🍽️',
          color: ['#10b981', '#059669'],
        };
      case 'inventory':
        return {
          title: 'Inventory Import',
          description: 'Import kitchen and bar inventory items from Excel',
          icon: '📦',
          color: ['#7c3aed', '#6d28d9'],
        };
      default:
        return {
          title: 'Complete Data Import',
          description: 'Import both menu items and inventory from Excel',
          icon: '📊',
          color: ['#1e3a8a', '#1e40af'],
        };
    }
  };

  const templateInfo = getTemplateInfo();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={templateInfo.color}
            style={styles.modalHeader}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerIcon}>{templateInfo.icon}</Text>
              <View style={styles.headerText}>
                <Text style={styles.modalTitle}>{templateInfo.title}</Text>
                <Text style={styles.modalSubtitle}>{templateInfo.description}</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView style={styles.modalBody}>
            {!importResults ? (
              <>
                {/* Template Download Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Download size={20} color="#1e3a8a" />
                    <Text style={styles.sectionTitle}>Step 1: Download Template</Text>
                  </View>
                  <Text style={styles.sectionDescription}>
                    Download the Excel template with the correct column format and sample data.
                  </Text>
                  
                  <TouchableOpacity style={styles.downloadButton} onPress={downloadTemplate}>
                    <LinearGradient
                      colors={['#f1f5f9', '#e2e8f0']}
                      style={styles.downloadButtonGradient}
                    >
                      <FileSpreadsheet size={20} color="#1e3a8a" />
                      <Text style={styles.downloadButtonText}>Download Excel Template</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* Instructions Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <FileText size={20} color="#059669" />
                    <Text style={styles.sectionTitle}>Step 2: Prepare Your Data</Text>
                  </View>
                  
                  <View style={styles.instructionsList}>
                    <View style={styles.instructionItem}>
                      <Text style={styles.instructionNumber}>1</Text>
                      <Text style={styles.instructionText}>Open the downloaded template in Excel</Text>
                    </View>
                    <View style={styles.instructionItem}>
                      <Text style={styles.instructionNumber}>2</Text>
                      <Text style={styles.instructionText}>Replace sample data with your actual data</Text>
                    </View>
                    <View style={styles.instructionItem}>
                      <Text style={styles.instructionNumber}>3</Text>
                      <Text style={styles.instructionText}>Keep the column headers exactly as shown</Text>
                    </View>
                    <View style={styles.instructionItem}>
                      <Text style={styles.instructionNumber}>4</Text>
                      <Text style={styles.instructionText}>Save the file as .xlsx format</Text>
                    </View>
                  </View>

                  {importType === 'menu' && (
                    <View style={styles.tipBox}>
                      <Text style={styles.tipTitle}>💡 Menu Import Tips:</Text>
                      <Text style={styles.tipText}>• Categories: appetizer, main_course, dessert, beverage, wine, beer, cocktail, spirits, coffee, tea, juice, water</Text>
                      <Text style={styles.tipText}>• Ingredients: Separate with commas (e.g., "chicken, herbs, oil")</Text>
                      <Text style={styles.tipText}>• Boolean fields: Use true/false or TRUE/FALSE</Text>
                      <Text style={styles.tipText}>• Difficulty: easy, medium, or hard</Text>
                    </View>
                  )}

                  {importType === 'inventory' && (
                    <View style={styles.tipBox}>
                      <Text style={styles.tipTitle}>📦 Inventory Import Tips:</Text>
                      <Text style={styles.tipText}>• Categories: food, beverage, alcohol, amenity, cleaning, maintenance, office, kitchen_equipment, bar_equipment</Text>
                      <Text style={styles.tipText}>• Units: pieces, kg, liters, bottles, boxes, etc.</Text>
                      <Text style={styles.tipText}>• Expiry dates: Use YYYY-MM-DD format</Text>
                      <Text style={styles.tipText}>• Storage locations: Kitchen Pantry, Bar Storage, Walk-in Cooler, etc.</Text>
                    </View>
                  )}
                </View>

                {/* Import Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Upload size={20} color="#7c3aed" />
                    <Text style={styles.sectionTitle}>Step 3: Import Your File</Text>
                  </View>
                  <Text style={styles.sectionDescription}>
                    Select your prepared Excel file to import the data into the system.
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.importButton} 
                    onPress={pickAndImportFile}
                    disabled={importing}
                  >
                    <LinearGradient
                      colors={importing ? ['#94a3b8', '#64748b'] : ['#7c3aed', '#8b5cf6']}
                      style={styles.importButtonGradient}
                    >
                      {importing ? (
                        <>
                          <ActivityIndicator color="white" size="small" />
                          <Text style={styles.importButtonText}>Processing...</Text>
                        </>
                      ) : (
                        <>
                          <Upload size={20} color="white" />
                          <Text style={styles.importButtonText}>Select Excel File</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* Results Section */
              <View style={styles.resultsSection}>
                <View style={styles.resultsHeader}>
                  <LinearGradient
                    colors={importResults.success > 0 ? ['#dcfce7', '#bbf7d0'] : ['#fecaca', '#fca5a5']}
                    style={styles.resultsIconContainer}
                  >
                    {importResults.success > 0 ? (
                      <CheckCircle size={32} color="#16a34a" />
                    ) : (
                      <AlertCircle size={32} color="#ef4444" />
                    )}
                  </LinearGradient>
                  <Text style={styles.resultsTitle}>Import Complete</Text>
                  <Text style={styles.resultsSubtitle}>
                    {importResults.success > 0 ? 'Data imported successfully!' : 'Import failed'}
                  </Text>
                </View>

                <View style={styles.resultsStats}>
                  <LinearGradient
                    colors={['#dcfce7', '#bbf7d0']}
                    style={styles.statCard}
                  >
                    <Text style={styles.statNumber}>{importResults.success}</Text>
                    <Text style={styles.statLabel}>Items Imported</Text>
                  </LinearGradient>
                  
                  <LinearGradient
                    colors={['#fecaca', '#fca5a5']}
                    style={styles.statCard}
                  >
                    <Text style={[styles.statNumber, { color: '#dc2626' }]}>
                      {importResults.errors.length}
                    </Text>
                    <Text style={styles.statLabel}>Errors</Text>
                  </LinearGradient>
                </View>

                {importResults.details.length > 0 && (
                  <View style={styles.detailsSection}>
                    <Text style={styles.detailsTitle}>Import Details:</Text>
                    {importResults.details.map((detail, index) => (
                      <View key={index} style={styles.detailItem}>
                        <CheckCircle size={16} color="#10b981" />
                        <Text style={styles.detailText}>{detail}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {importResults.errors.length > 0 && (
                  <View style={styles.errorsSection}>
                    <Text style={styles.errorsTitle}>Import Errors:</Text>
                    <ScrollView style={styles.errorsList}>
                      {importResults.errors.slice(0, 10).map((error, index) => (
                        <View key={index} style={styles.errorItem}>
                          <AlertCircle size={14} color="#ef4444" />
                          <Text style={styles.errorText}>{error}</Text>
                        </View>
                      ))}
                      {importResults.errors.length > 10 && (
                        <Text style={styles.moreErrorsText}>
                          ... and {importResults.errors.length - 10} more errors
                        </Text>
                      )}
                    </ScrollView>
                  </View>
                )}

                <TouchableOpacity 
                  style={styles.doneButton} 
                  onPress={() => {
                    setImportResults(null);
                    onClose();
                  }}
                >
                  <LinearGradient
                    colors={['#1e3a8a', '#3b82f6']}
                    style={styles.doneButtonGradient}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '85%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  headerIcon: {
    fontSize: 32,
  },
  headerText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  modalBody: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  downloadButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  downloadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: '#dbeafe',
  },
  downloadButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e3a8a',
  },
  instructionsList: {
    gap: 12,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
  },
  tipBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  tipTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#0369a1',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#0369a1',
    marginBottom: 4,
  },
  importButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  importButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  importButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  resultsSection: {
    alignItems: 'center',
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultsIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  resultsStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  statCard: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#16a34a',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
    marginTop: 4,
  },
  detailsSection: {
    width: '100%',
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#16a34a',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#059669',
  },
  errorsSection: {
    width: '100%',
    marginBottom: 24,
  },
  errorsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
    marginBottom: 12,
  },
  errorsList: {
    maxHeight: 150,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#dc2626',
    flex: 1,
    lineHeight: 16,
  },
  moreErrorsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#dc2626',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  doneButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});