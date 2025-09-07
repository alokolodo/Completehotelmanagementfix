import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Database, ExternalLink } from 'lucide-react-native';

interface DatabaseSetupGuideProps {
  onClose: () => void;
}

export function DatabaseSetupGuide({ onClose }: DatabaseSetupGuideProps) {
  const openSupabaseDashboard = () => {
    Linking.openURL('https://supabase.com/dashboard/project/lxcdgrjgtqkntfndpdsu/sql');
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Database size={24} color="#1e3a8a" />
          <Text style={styles.title}>Database Setup Required</Text>
        </View>
        
        <Text style={styles.description}>
          The database schema needs to be set up before you can create accounts.
        </Text>
        
        <View style={styles.steps}>
          <Text style={styles.stepTitle}>Follow these steps:</Text>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1.</Text>
            <Text style={styles.stepText}>
              Go to your Supabase Dashboard → SQL Editor
            </Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2.</Text>
            <Text style={styles.stepText}>
              Run the migration files: create_hotel_schema.sql and insert_sample_data.sql
            </Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3.</Text>
            <Text style={styles.stepText}>
              Come back and try creating an account again
            </Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.dashboardButton} onPress={openSupabaseDashboard}>
            <ExternalLink size={16} color="white" />
            <Text style={styles.dashboardButtonText}>Open Supabase Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>I'll Set It Up Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 400,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  steps: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1e3a8a',
    marginRight: 8,
    minWidth: 20,
  },
  stepText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  dashboardButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  closeButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});