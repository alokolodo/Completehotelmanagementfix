import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Wifi, Moon, Globe, CircleHelp as HelpCircle, LogOut, Save, Star, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function Settings() {
  const { profile, signOut } = useAuthContext();
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  
  const [hotelSettings, setHotelSettings] = useState({
    hotelName: 'Grand Hotel',
    address: '123 Main Street, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@grandhotel.com',
    website: 'www.grandhotel.com',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    currency: 'USD',
    timezone: 'America/New_York',
    taxRate: 8.5,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newBookings: true,
    checkInReminders: true,
    lowInventory: true,
    maintenanceAlerts: true,
    staffUpdates: false,
    marketingEmails: false,
  });

  const [systemSettings, setSystemSettings] = useState({
    darkMode: false,
    offlineMode: true,
    autoBackup: true,
    dataSync: true,
    debugMode: false,
  });

  React.useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSaveSettings = async () => {
    // Update hotel name in the system
    if (hotelSettings.hotelName) {
      const saved = await saveHotelSettings();
      if (saved) {
        Alert.alert('Success', 'Settings saved successfully. Changes will be reflected across the system.');
      } else {
        Alert.alert('Error', 'Failed to save settings. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Hotel name cannot be empty');
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth');
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This will export all hotel data to a backup file. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => Alert.alert('Info', 'Data export functionality would be implemented here') }
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'This will import data from a backup file. This action cannot be undone. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Import', style: 'destructive', onPress: () => Alert.alert('Info', 'Data import functionality would be implemented here') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#64748b', '#94a3b8', '#cbd5e1']}
        style={styles.headerGradient}
      >
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.headerLeft}>
            <View style={styles.titleContainer}>
              <SettingsIcon size={28} color="white" />
              <View>
                <Text style={styles.title}>Settings</Text>
                <Text style={styles.subtitle}>System Configuration</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.saveButtonGradient}
              >
                <Save size={20} color="white" />
                <Sparkles size={12} color="white" style={styles.sparkle} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {/* User Profile Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.sectionGradient}
          >
            <View style={styles.sectionHeader}>
              <LinearGradient
                colors={['#dbeafe', '#bfdbfe']}
                style={styles.sectionIconContainer}
              >
                <User size={20} color="#1e3a8a" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>Profile Information</Text>
            </View>
            
            <LinearGradient
              colors={['#f8fafc', '#f1f5f9']}
              style={styles.profileCard}
            >
              <View style={styles.profileHeader}>
                <Star size={20} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.profileName}>{profile?.full_name}</Text>
              </View>
              <Text style={styles.profileEmail}>{profile?.email}</Text>
              <LinearGradient
                colors={['#1e3a8a', '#3b82f6']}
                style={styles.roleBadge}
              >
                <Shield size={12} color="white" />
                <Text style={styles.roleText}>
                  {profile?.role.replace('_', ' ').toUpperCase()}
                </Text>
              </LinearGradient>
            </LinearGradient>
          </LinearGradient>
        </Animated.View>

        {/* Hotel Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SettingsIcon size={20} color="#1e3a8a" />
            <Text style={styles.sectionTitle}>Hotel Configuration</Text>
          </View>

          <View style={styles.settingsGroup}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hotel Name</Text>
              <TextInput
                style={styles.textInput}
                value={hotelSettings.hotelName}
                onChangeText={(text) => setHotelSettings({ ...hotelSettings, hotelName: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={hotelSettings.address}
                onChangeText={(text) => setHotelSettings({ ...hotelSettings, address: text })}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Check-in Time</Text>
                <TextInput
                  style={styles.textInput}
                  value={hotelSettings.checkInTime}
                  onChangeText={(text) => setHotelSettings({ ...hotelSettings, checkInTime: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Check-out Time</Text>
                <TextInput
                  style={styles.textInput}
                  value={hotelSettings.checkOutTime}
                  onChangeText={(text) => setHotelSettings({ ...hotelSettings, checkOutTime: text })}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Currency</Text>
                <TextInput
                  style={styles.textInput}
                  value={hotelSettings.currency}
                  onChangeText={(text) => setHotelSettings({ ...hotelSettings, currency: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tax Rate (%)</Text>
                <TextInput
                  style={styles.textInput}
                  value={hotelSettings.taxRate.toString()}
                  onChangeText={(text) => setHotelSettings({ ...hotelSettings, taxRate: parseFloat(text) || 0 })}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color="#1e3a8a" />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>

          <View style={styles.settingsGroup}>
            {Object.entries(notificationSettings).map(([key, value]) => (
              <View key={key} style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Text>
                <Switch
                  value={value}
                  onValueChange={(newValue) => 
                    setNotificationSettings({ ...notificationSettings, [key]: newValue })
                  }
                  trackColor={{ false: '#e2e8f0', true: '#1e3a8a' }}
                  thumbColor={value ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            ))}
          </View>
        </View>

        {/* System Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={20} color="#1e3a8a" />
            <Text style={styles.sectionTitle}>System</Text>
          </View>

          <View style={styles.settingsGroup}>
            {Object.entries(systemSettings).map(([key, value]) => (
              <View key={key} style={styles.switchRow}>
                <View style={styles.switchLabelContainer}>
                  <Text style={styles.switchLabel}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Text>
                  {key === 'offlineMode' && (
                    <Text style={styles.switchDescription}>
                      Allow app to work without internet connection
                    </Text>
                  )}
                  {key === 'autoBackup' && (
                    <Text style={styles.switchDescription}>
                      Automatically backup data daily
                    </Text>
                  )}
                  {key === 'dataSync' && (
                    <Text style={styles.switchDescription}>
                      Sync data across all devices
                    </Text>
                  )}
                </View>
                <Switch
                  value={value}
                  onValueChange={(newValue) => 
                    setSystemSettings({ ...systemSettings, [key]: newValue })
                  }
                  trackColor={{ false: '#e2e8f0', true: '#1e3a8a' }}
                  thumbColor={value ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={20} color="#1e3a8a" />
            <Text style={styles.sectionTitle}>Data Management</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
              <Database size={16} color="#1e3a8a" />
              <Text style={styles.actionButtonText}>Export Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleImportData}>
              <Database size={16} color="#1e3a8a" />
              <Text style={styles.actionButtonText}>Import Data</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => Alert.alert('Info', 'Database cleanup functionality would be implemented here')}
            >
              <Database size={16} color="#1e3a8a" />
              <Text style={styles.actionButtonText}>Clean Database</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Help & Support */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <HelpCircle size={20} color="#1e3a8a" />
            <Text style={styles.sectionTitle}>Help & Support</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('User Manual', 'User manual functionality would be implemented here')}
            >
              <HelpCircle size={16} color="#1e3a8a" />
              <Text style={styles.actionButtonText}>User Manual</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Contact Support', 'Support contact functionality would be implemented here')}
            >
              <HelpCircle size={16} color="#1e3a8a" />
              <Text style={styles.actionButtonText}>Contact Support</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('About', 'Hotel Management System v1.0.0\nBuilt with React Native & Expo')}
            >
              <HelpCircle size={16} color="#1e3a8a" />
              <Text style={styles.actionButtonText}>About</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hotel Management System</Text>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerLeft: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  headerActions: {
    marginTop: 8,
  },
  saveButton: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  saveButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sparkle: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 20,
    marginTop: 0,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionGradient: {
    borderRadius: 20,
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e3a8a',
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 16,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  roleText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  settingsGroup: {
    gap: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
  },
  switchDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    marginBottom: 2,
  },
});
