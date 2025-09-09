import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Hotel, Shield, Users, Star, Sparkles } from 'lucide-react-native';
import { Database } from '@/types/database';

const { width, height } = Dimensions.get('window');

type UserRole = Database['public']['Tables']['profiles']['Row']['role'];

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('receptionist');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const { signIn, signUp } = useAuthContext();
  const router = useRouter();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    let error;

    if (isSignUp) {
      if (!fullName) {
        Alert.alert('Error', 'Please enter your full name');
        setLoading(false);
        return;
      }
      const result = await signUp(email, password, fullName, role);
      error = result.error;
    } else {
      const result = await signIn(email, password);
      error = result.error;
    }

    if (error) {
      Alert.alert('Authentication Error', error.message);
    } else {
      router.replace('/(tabs)');
    }

    setLoading(false);
  };

  const roleOptions: { key: UserRole; label: string }[] = [
    { key: 'admin', label: 'Administrator' },
    { key: 'manager', label: 'Manager' },
    { key: 'receptionist', label: 'Receptionist' },
    { key: 'kitchen_staff', label: 'Kitchen Staff' },
    { key: 'bar_staff', label: 'Bar Staff' },
    { key: 'housekeeping', label: 'Housekeeping' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'accountant', label: 'Accountant' },
    { key: 'store_keeper', label: 'Store Keeper' },
  ];

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#334155']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#3b82f6', '#1e3a8a']}
                style={styles.logoGradient}
              >
                <Hotel size={40} color="white" />
              </LinearGradient>
              <View style={styles.sparkleContainer}>
                <Sparkles size={16} color="#fbbf24" />
                <Sparkles size={12} color="#60a5fa" />
                <Sparkles size={14} color="#f59e0b" />
              </View>
            </View>
            <Text style={styles.title}>Hotel Management System</Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Create your account' : 'Sign in to continue'}
            </Text>
          </Animated.View>

          <Animated.View 
            style={[
              styles.form,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
              style={styles.formGradient}
            >
              <View style={styles.demoInfo}>
                <LinearGradient
                  colors={['#dbeafe', '#bfdbfe']}
                  style={styles.demoGradient}
                >
                  <View style={styles.demoHeader}>
                    <Hotel size={24} color="#1e3a8a" />
                    <Text style={styles.demoTitle}>Premium Hotel Management</Text>
                  </View>
                  <View style={styles.featuresList}>
                    <View style={styles.featureItem}>
                      <Star size={16} color="#fbbf24" fill="#fbbf24" />
                      <Text style={styles.demoText}>Fully functional offline system</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Shield size={16} color="#10b981" />
                      <Text style={styles.demoText}>Role-based access control</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Users size={16} color="#8b5cf6" />
                      <Text style={styles.demoText}>Complete hotel operations</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Sparkles size={16} color="#f59e0b" />
                      <Text style={styles.demoText}>Advanced analytics & reporting</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>

            {isSignUp && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password (min 6 characters)"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {isSignUp && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Role</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.roleContainer}>
                    {roleOptions.map((option) => (
                      <TouchableOpacity
                        key={option.key}
                        style={[
                          styles.roleOption,
                          role === option.key && styles.roleOptionActive,
                        ]}
                        onPress={() => setRole(option.key)}
                      >
                        {role === option.key && (
                          <LinearGradient
                            colors={['#1e3a8a', '#3b82f6']}
                            style={styles.roleOptionGradient}
                          >
                            <Text style={styles.roleOptionTextActive}>
                              {option.label}
                            </Text>
                          </LinearGradient>
                        )}
                        {role !== option.key && (
                        <Text
                          style={styles.roleOptionText}
                        >
                          {option.label}
                        </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              onPress={handleAuth}
              disabled={loading}
              style={styles.buttonContainer}
            >
              <LinearGradient
                colors={loading ? ['#94a3b8', '#64748b'] : ['#1e3a8a', '#3b82f6']}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text style={styles.switchButtonText}>
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    flexDirection: 'row',
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  form: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  formGradient: {
    borderRadius: 24,
    padding: 28,
  },
  demoInfo: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  demoGradient: {
    padding: 20,
    borderRadius: 16,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  demoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1e3a8a',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  demoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1e3a8a',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 12,
  },
  inputWrapper: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  roleOptionGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  roleOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  roleOptionTextActive: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  buttonContainer: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  switchButton: {
    alignItems: 'center',
    padding: 12,
  },
  switchButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});