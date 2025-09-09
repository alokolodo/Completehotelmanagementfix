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
import { Upload, FileSpreadsheet, Download, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

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
  } | null>(null);

  const downloadTemplate = () => {
    Alert.alert(
      'Download Template',
      'Template download functionality would open a pre-formatted Excel file with the correct columns.',
      [{ text: 'OK' }]
    );
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

      // Process based on import type
      if (importType === 'menu' || importType === 'all') {
        const menuResult = await processMenuSheet(workbook);
        totalSuccess += menuResult.success;
        allErrors.push(...menuResult.errors);
      }

      if (importType === 'inventory' || importType === 'all') {
        const inventoryResult = await processInventorySheet(workbook);
        totalSuccess += inventoryResult.success;
        allErrors.push(...inventoryResult.errors);
      }

      setImportResults({
        success: totalSuccess,
        errors: allErrors,
        type: importType,
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
    const sheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('menu') || name.toLowerCase().includes('food') || name.toLowerCase().includes('drink')
    ) || workbook.SheetNames[0];

    if (!sheetName) {
      return { success: 0, errors: ['No menu sheet found'] };
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    let success = 0;
    const errors: string[] = [];

    for (const row of data) {
      try {
        const menuItem: any = row;
        
        // Validate required fields
        if (!menuItem.name || !menuItem.description || !menuItem.category || !menuItem.price) {
          errors.push(`Row skipped: Missing required fields (name, description, category, price)`);
          continue;
        }

        // Parse ingredients if it's a string
        let ingredients = [];
        if (menuItem.ingredients) {
          if (typeof menuItem.ingredients === 'string') {
            ingredients = menuItem.ingredients.split(',').map((ing: string) => ing.trim());
          } else if (Array.isArray(menuItem.ingredients)) {
            ingredients = menuItem.ingredients;
          }
        }

        // Parse allergens if it's a string
        let allergens = [];
        if (menuItem.allergens) {
          if (typeof menuItem.allergens === 'string') {
            allergens = menuItem.allergens.split(',').map((all: string) => all.trim());
          } else if (Array.isArray(menuItem.allergens)) {
            allergens = menuItem.allergens;
          }
        }

        const newMenuItem = {
          name: menuItem.name,
          description: menuItem.description,
          category: menuItem.category.toLowerCase(),
          subcategory: menuItem.subcategory || '',
          price: parseFloat(menuItem.price) || 0,
          cost_price: parseFloat(menuItem.cost_price) || 0,
          ingredients,
          allergens,
          prep_time_minutes: parseInt(menuItem.prep_time_minutes) || 0,
          cooking_time_minutes: parseInt(menuItem.cooking_time_minutes) || 0,
          difficulty_level: menuItem.difficulty_level || 'easy',
          is_available: menuItem.is_available !== false,
          is_vegetarian: menuItem.is_vegetarian === true,
          is_vegan: menuItem.is_vegan === true,
          is_gluten_free: menuItem.is_gluten_free === true,
          calories: parseInt(menuItem.calories) || 0,
        };

        await db.insert<MenuItem>('menu_items', newMenuItem);
        success++;
      } catch (error) {
        errors.push(`Failed to import menu item: ${menuItem.name || 'Unknown'} - ${error}`);
      }
    }

    return { success, errors };
  };

  const processInventorySheet = async (workbook: XLSX.WorkBook) => {
    const sheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('inventory') || name.toLowerCase().includes('stock') || name.toLowerCase().includes('store')
    ) || workbook.SheetNames[0];

    if (!sheetName) {
      return { success: 0, errors: ['No inventory sheet found'] };
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    let success = 0;
    const errors: string[] = [];

    for (const row of data) {
      try {
        const inventoryItem: any = row;
        
        // Validate required fields
        if (!inventoryItem.item_name || !inventoryItem.category || !inventoryItem.unit_cost || !inventoryItem.supplier) {
          errors.push(`Row skipped: Missing required fields (item_name, category, unit_cost, supplier)`);
          continue;
        }

        const newInventoryItem = {
          item_name: inventoryItem.item_name,
          category: inventoryItem.category.toLowerCase(),
          subcategory: inventoryItem.subcategory || '',
          current_stock: parseInt(inventoryItem.current_stock) || 0,
          minimum_stock: parseInt(inventoryItem.minimum_stock) || 0,
          maximum_stock: parseInt(inventoryItem.maximum_stock) || 100,
          unit: inventoryItem.unit || 'pieces',
          unit_cost: parseFloat(inventoryItem.unit_cost) || 0,
          total_value: (parseInt(inventoryItem.current_stock) || 0) * (parseFloat(inventoryItem.unit_cost) || 0),
          supplier: inventoryItem.supplier,
          supplier_contact: inventoryItem.supplier_contact || '',
          storage_location: inventoryItem.storage_location || 'General Storage',
          expiry_date: inventoryItem.expiry_date || null,
          batch_number: inventoryItem.batch_number || '',
          last_restocked: new Date().toISOString(),
          reorder_point: parseInt(inventoryItem.reorder_point) || parseInt(inventoryItem.minimum_stock) || 0,
          is_perishable: inventoryItem.is_perishable === true,
          barcode: inventoryItem.barcode || '',
        };

        await db.insert<InventoryItem>('inventory', newInventoryItem);
        success++;
      } catch (error) {
        errors.push(`Failed to import inventory item: ${inventoryItem.item_name || 'Unknown'} - ${error}`);
      }
    }

    return { success, errors };
  };

  const getTemplateInfo = () => {
    switch (importType) {
      case 'menu':
        return {
          title: 'Menu Items Template',
          description: 'Import restaurant and bar menu items',
          columns: ['name', 'description', 'category', 'subcategory', 'price', 'cost_price', 'ingredients', 'allergens', 'prep_time_minutes', 'cooking_time_minutes', 'difficulty_level', 'is_vegetarian', 'is_vegan', 'is_gluten_free', 'calories'],
        };
      case 'inventory':
        return {
          title: 'Inventory Template',
          description: 'Import kitchen and bar inventory items',
          columns: ['item_name', 'category', 'subcategory', 'current_stock', 'minimum_stock', 'maximum_stock', 'unit', 'unit_cost', 'supplier', 'supplier_contact', 'storage_location', 'expiry_date', 'is_perishable'],
        };
      default:
        return {
          title: 'Complete Import Template',
          description: 'Import both menu items and inventory',
          columns: ['Multiple sheets: Menu, Inventory'],
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
          <View style={styles.modalHeader}>
            <FileSpreadsheet size={24} color="#1e3a8a" />
            <Text style={styles.modalTitle}>Excel Import</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {!importResults ? (
              <>
                <View style={styles.templateSection}>
                  <Text style={styles.sectionTitle}>{templateInfo.title}</Text>
                  <Text style={styles.sectionDescription}>{templateInfo.description}</Text>
                  
                  <TouchableOpacity style={styles.downloadButton} onPress={downloadTemplate}>
                    <Download size={16} color="#1e3a8a" />
                    <Text style={styles.downloadButtonText}>Download Template</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.columnsSection}>
                  <Text style={styles.sectionTitle}>Required Columns</Text>
                  <View style={styles.columnsList}>
                    {templateInfo.columns.map((column, index) => (
                      <View key={index} style={styles.columnItem}>
                        <Text style={styles.columnText}>{column}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.importSection}>
                  <Text style={styles.sectionTitle}>Import Data</Text>
                  <Text style={styles.importDescription}>
                    Select an Excel file (.xlsx or .xls) with your data. Make sure the columns match the template format.
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.importButton} 
                    onPress={pickAndImportFile}
                    disabled={importing}
                  >
                    <LinearGradient
                      colors={importing ? ['#94a3b8', '#64748b'] : ['#1e3a8a', '#3b82f6']}
                      style={styles.importButtonGradient}
                    >
                      {importing ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Upload size={20} color="white" />
                      )}
                      <Text style={styles.importButtonText}>
                        {importing ? 'Importing...' : 'Select Excel File'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.resultsSection}>
                <View style={styles.resultsHeader}>
                  {importResults.success > 0 ? (
                    <CheckCircle size={32} color="#10b981" />
                  ) : (
                    <AlertCircle size={32} color="#ef4444" />
                  )}
                  <Text style={styles.resultsTitle}>Import Complete</Text>
                </View>

                <View style={styles.resultsStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{importResults.success}</Text>
                    <Text style={styles.statLabel}>Items Imported</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: '#ef4444' }]}>
                      {importResults.errors.length}
                    </Text>
                    <Text style={styles.statLabel}>Errors</Text>
                  </View>
                </View>

                {importResults.errors.length > 0 && (
                  <View style={styles.errorsSection}>
                    <Text style={styles.errorsTitle}>Import Errors:</Text>
                    <ScrollView style={styles.errorsList}>
                      {importResults.errors.map((error, index) => (
                        <Text key={index} style={styles.errorText}>
                          • {error}
                        </Text>
                      ))}
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
                  <Text style={styles.doneButtonText}>Done</Text>
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
    borderRadius: 16,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    flex: 1,
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#64748b',
  },
  modalBody: {
    padding: 20,
  },
  templateSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e3a8a',
  },
  columnsSection: {
    marginBottom: 24,
  },
  columnsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  columnItem: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  columnText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  importSection: {
    marginBottom: 24,
  },
  importDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  importButton: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  importButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  importButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  resultsSection: {
    alignItems: 'center',
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginTop: 8,
  },
  resultsStats: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10b981',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  errorsSection: {
    width: '100%',
    marginBottom: 20,
  },
  errorsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorsList: {
    maxHeight: 120,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#dc2626',
    marginBottom: 4,
  },
  doneButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});