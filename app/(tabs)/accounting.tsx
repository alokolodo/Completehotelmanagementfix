import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { DatePicker } from '@/components/DatePicker';
import { Calculator, DollarSign, TrendingUp, TrendingDown, Calendar, FileText, CreditCard, ChartPie as PieChart, Star, Sparkles, ChefHat, Wine } from 'lucide-react-native';

type Booking = Database['public']['Tables']['bookings']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];
type Expense = Database['public']['Tables']['expenses']['Row'];

const { width } = Dimensions.get('window');

interface FinancialData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  roomRevenue: number;
  foodRevenue: number;
  barRevenue: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  occupancyRevenue: number;
  avgDailyRate: number;
}

export default function Accounting() {
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    roomRevenue: 0,
    foodRevenue: 0,
    barRevenue: 0,
    monthlyRevenue: 0,
    dailyRevenue: 0,
    occupancyRevenue: 0,
    avgDailyRate: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    loadFinancialData();
    
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
  }, [selectedPeriod]);

  const loadFinancialData = async () => {
    try {
      const now = new Date();
      const startDate = getStartDate(now, selectedPeriod);

      // Load bookings revenue
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .eq('payment_status', 'paid');

      if (bookingsError) throw bookingsError;

      // Load orders revenue
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .eq('payment_status', 'paid');

      if (ordersError) throw ordersError;

      // Load expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (expensesError) throw expensesError;

      // Calculate financial metrics
      const roomRevenue = bookings?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;
      
      const foodOrders = orders?.filter(order => order.order_type === 'restaurant') || [];
      const barOrders = orders?.filter(order => order.order_type === 'bar') || [];
      
      const foodRevenue = foodOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const barRevenue = barOrders.reduce((sum, order) => sum + order.total_amount, 0);
      
      const totalRevenue = roomRevenue + foodRevenue + barRevenue;
      const totalExpenses = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
      const netProfit = totalRevenue - totalExpenses;

      // Calculate additional metrics
      const daysInPeriod = getDaysInPeriod(selectedPeriod);
      const dailyRevenue = totalRevenue / daysInPeriod;
      const avgDailyRate = bookings && bookings.length > 0 ? roomRevenue / bookings.length : 0;

      setFinancialData({
        totalRevenue,
        totalExpenses,
        netProfit,
        roomRevenue,
        foodRevenue,
        barRevenue,
        monthlyRevenue: totalRevenue,
        dailyRevenue,
        occupancyRevenue: roomRevenue,
        avgDailyRate,
      });

      // Prepare recent transactions
      const transactions = [
        ...bookings?.map(booking => ({
          id: booking.id,
          type: 'Room Booking',
          amount: booking.total_amount,
          date: booking.created_at,
          description: `${booking.guest_name} - Room booking`,
        })) || [],
        ...orders?.map(order => ({
          id: order.id,
          type: order.order_type === 'restaurant' ? 'Restaurant' : 'Bar',
          amount: order.total_amount,
          date: order.created_at,
          description: `${order.order_type} order`,
        })) || [],
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setRecentTransactions(transactions.slice(0, 10));
      setExpenses(expensesData || []);

    } catch (error) {
      console.error('Error loading financial data:', error);
      Alert.alert('Error', 'Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (now: Date, period: string) => {
    switch (period) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        return weekStart;
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  };

  const getDaysInPeriod = (period: string) => {
    switch (period) {
      case 'today': return 1;
      case 'week': return 7;
      case 'month': return 30;
      case 'year': return 365;
      default: return 30;
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadFinancialData();
    setRefreshing(false);
  }, [selectedPeriod]);

  const generateReport = () => {
    Alert.alert(
      'Generate Report',
      'Financial report generation will be implemented with PDF export functionality.',
      [{ text: 'OK' }]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getRevenueBreakdown = () => {
    const total = financialData.totalRevenue;
    if (total === 0) return { room: 0, food: 0, bar: 0 };
    
    return {
      room: (financialData.roomRevenue / total) * 100,
      food: (financialData.foodRevenue / total) * 100,
      bar: (financialData.barRevenue / total) * 100,
    };
  };

  const breakdown = getRevenueBreakdown();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#10b981', '#34d399']}
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
              <Calculator size={28} color="white" />
              <View>
                <Text style={styles.title}>Accounting</Text>
                <Text style={styles.subtitle}>Financial Management</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.reportButton} onPress={generateReport}>
              <LinearGradient
                colors={['#1e3a8a', '#3b82f6']}
                style={styles.reportButtonGradient}
              >
                <FileText size={20} color="white" />
                <Sparkles size={12} color="white" style={styles.sparkle} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Period Selector */}
      <Animated.View 
        style={[
          styles.periodSelector,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.periodGradient}
        >
          {['today', 'week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={styles.periodButtonContainer}
              onPress={() => setSelectedPeriod(period as any)}
            >
              {selectedPeriod === period ? (
                <LinearGradient
                  colors={['#059669', '#10b981']}
                  style={styles.activePeriodButton}
                >
                  <Text style={styles.activePeriodButtonText}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </LinearGradient>
              ) : (
                <Text style={styles.periodButtonText}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </LinearGradient>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Key Financial Metrics */}
        <Animated.View 
          style={[
            styles.metricsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Financial Overview</Text>
          
          <View style={styles.metricsGrid}>
            <TouchableOpacity style={styles.metricCard}>
              <LinearGradient
                colors={['#dcfce7', '#bbf7d0']}
                style={styles.metricGradient}
              >
                <View style={styles.metricIconContainer}>
                  <LinearGradient
                    colors={['#16a34a', '#22c55e']}
                    style={styles.metricIcon}
                  >
                    <TrendingUp size={24} color="white" />
                  </LinearGradient>
                </View>
                <Text style={styles.metricLabel}>Total Revenue</Text>
                <Text style={styles.metricValue}>{formatCurrency(financialData.totalRevenue)}</Text>
                <Text style={styles.metricSubtext}>
                  {formatCurrency(financialData.dailyRevenue)}/day avg
                </Text>
                <View style={styles.trendIndicator}>
                  <TrendingUp size={12} color="#16a34a" />
                  <Text style={styles.trendText}>+12.5%</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.metricCard}>
              <LinearGradient
                colors={['#fecaca', '#fca5a5']}
                style={styles.metricGradient}
              >
                <View style={styles.metricIconContainer}>
                  <LinearGradient
                    colors={['#ef4444', '#dc2626']}
                    style={styles.metricIcon}
                  >
                    <TrendingDown size={24} color="white" />
                  </LinearGradient>
                </View>
                <Text style={styles.metricLabel}>Total Expenses</Text>
                <Text style={styles.metricValue}>{formatCurrency(financialData.totalExpenses)}</Text>
                <View style={styles.trendIndicator}>
                  <TrendingDown size={12} color="#ef4444" />
                  <Text style={[styles.trendText, { color: '#ef4444' }]}>+5.2%</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.metricCard}>
              <LinearGradient
                colors={financialData.netProfit >= 0 ? ['#dcfce7', '#bbf7d0'] : ['#fecaca', '#fca5a5']}
                style={styles.metricGradient}
              >
                <View style={styles.metricIconContainer}>
                  <LinearGradient
                    colors={financialData.netProfit >= 0 ? ['#16a34a', '#22c55e'] : ['#ef4444', '#dc2626']}
                    style={styles.metricIcon}
                  >
                    <DollarSign size={24} color="white" />
                  </LinearGradient>
                </View>
                <Text style={styles.metricLabel}>Net Profit</Text>
                <Text style={[
                  styles.metricValue,
                  { color: financialData.netProfit >= 0 ? '#16a34a' : '#ef4444' }
                ]}>
                  {formatCurrency(financialData.netProfit)}
                </Text>
                <Text style={styles.metricSubtext}>
                  {financialData.totalRevenue > 0 
                    ? `${((financialData.netProfit / financialData.totalRevenue) * 100).toFixed(1)}% margin`
                    : 'N/A'
                  }
                </Text>
                <View style={styles.trendIndicator}>
                  <TrendingUp size={12} color="#16a34a" />
                  <Text style={styles.trendText}>+8.7%</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.metricCard}>
              <LinearGradient
                colors={['#dbeafe', '#bfdbfe']}
                style={styles.metricGradient}
              >
                <View style={styles.metricIconContainer}>
                  <LinearGradient
                    colors={['#1e3a8a', '#3b82f6']}
                    style={styles.metricIcon}
                  >
                    <Calculator size={24} color="white" />
                  </LinearGradient>
                </View>
                <Text style={styles.metricLabel}>Avg Daily Rate</Text>
                <Text style={styles.metricValue}>{formatCurrency(financialData.avgDailyRate)}</Text>
                <View style={styles.trendIndicator}>
                  <TrendingUp size={12} color="#1e3a8a" />
                  <Text style={[styles.trendText, { color: '#1e3a8a' }]}>+3.1%</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Revenue Breakdown */}
        <Animated.View 
          style={[
            styles.breakdownSection,
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
            <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
            
            <View style={styles.breakdownContainer}>
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <LinearGradient
                    colors={['#dbeafe', '#bfdbfe']}
                    style={styles.breakdownIcon}
                  >
                    <DollarSign size={20} color="#1e3a8a" />
                  </LinearGradient>
                  <View style={styles.breakdownInfo}>
                    <Text style={styles.breakdownLabel}>Room Revenue</Text>
                    <Text style={styles.breakdownAmount}>{formatCurrency(financialData.roomRevenue)}</Text>
                  </View>
                  <Text style={styles.breakdownPercentage}>{breakdown.room.toFixed(1)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={['#1e3a8a', '#3b82f6']}
                    style={[styles.progressFill, { width: `${breakdown.room}%` }]}
                  />
                </View>
              </View>

              <View style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <LinearGradient
                    colors={['#dcfce7', '#bbf7d0']}
                    style={styles.breakdownIcon}
                  >
                    <ChefHat size={20} color="#16a34a" />
                  </LinearGradient>
                  <View style={styles.breakdownInfo}>
                    <Text style={styles.breakdownLabel}>Restaurant Revenue</Text>
                    <Text style={styles.breakdownAmount}>{formatCurrency(financialData.foodRevenue)}</Text>
                  </View>
                  <Text style={styles.breakdownPercentage}>{breakdown.food.toFixed(1)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={['#16a34a', '#22c55e']}
                    style={[styles.progressFill, { width: `${breakdown.food}%` }]}
                  />
                </View>
              </View>

              <View style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <LinearGradient
                    colors={['#e0e7ff', '#c7d2fe']}
                    style={styles.breakdownIcon}
                  >
                    <Wine size={20} color="#7c3aed" />
                  </LinearGradient>
                  <View style={styles.breakdownInfo}>
                    <Text style={styles.breakdownLabel}>Bar Revenue</Text>
                    <Text style={styles.breakdownAmount}>{formatCurrency(financialData.barRevenue)}</Text>
                  </View>
                  <Text style={styles.breakdownPercentage}>{breakdown.bar.toFixed(1)}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={['#7c3aed', '#a855f7']}
                    style={[styles.progressFill, { width: `${breakdown.bar}%` }]}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          <View style={styles.transactionsContainer}>
            {recentTransactions.map((transaction, index) => (
              <View key={transaction.id || index} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  {transaction.type === 'Room Booking' && <Calendar size={16} color="#1e3a8a" />}
                  {transaction.type === 'Restaurant' && <ChefHat size={16} color="#16a34a" />}
                  {transaction.type === 'Bar' && <Wine size={16} color="#7c3aed" />}
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionType}>{transaction.type}</Text>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.transactionAmount}>
                  +{formatCurrency(transaction.amount)}
                </Text>
              </View>
            ))}

            {recentTransactions.length === 0 && (
              <View style={styles.noTransactions}>
                <Text style={styles.noTransactionsText}>No transactions found for this period</Text>
              </View>
            )}
          </View>
        </View>

        {/* Expenses Summary */}
        {expenses.length > 0 && (
          <View style={styles.expensesSection}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            
            <View style={styles.expensesContainer}>
              {expenses.slice(0, 5).map((expense) => (
                <View key={expense.id} style={styles.expenseItem}>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <Text style={styles.expenseCategory}>{expense.category.replace('_', ' ')}</Text>
                    <Text style={styles.expenseDate}>
                      {new Date(expense.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.expenseAmount}>
                    -{formatCurrency(expense.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Export Options */}
        <View style={styles.exportSection}>
          <Text style={styles.sectionTitle}>Export & Reports</Text>
          
          <View style={styles.exportOptions}>
            <TouchableOpacity style={styles.exportButton} onPress={generateReport}>
              <FileText size={20} color="#1e3a8a" />
              <Text style={styles.exportButtonText}>Financial Report (PDF)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.exportButton} onPress={generateReport}>
              <PieChart size={20} color="#16a34a" />
              <Text style={styles.exportButtonText}>Revenue Analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.exportButton} onPress={generateReport}>
              <CreditCard size={20} color="#7c3aed" />
              <Text style={styles.exportButtonText}>Payment Summary</Text>
            </TouchableOpacity>
          </View>
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
  reportButton: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  reportButtonGradient: {
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
  periodSelector: {
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  periodGradient: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 6,
  },
  periodButtonContainer: {
    flex: 1,
  },
  activePeriodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    paddingVertical: 12,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  activePeriodButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  metricsSection: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: 160,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  metricGradient: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  metricIconContainer: {
    marginBottom: 16,
  },
  metricIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  metricSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 12,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#16a34a',
  },
  breakdownSection: {
    margin: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  sectionGradient: {
    borderRadius: 20,
    padding: 24,
  },
  breakdownContainer: {
    gap: 20,
  },
  breakdownItem: {
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
    borderRadius: 16,
    padding: 16,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  breakdownIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  breakdownInfo: {
    flex: 1,
  },
  breakdownLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  breakdownAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginTop: 2,
  },
  breakdownPercentage: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1e3a8a',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  transactionsSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  transactionsContainer: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    gap: 12,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  transactionDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#16a34a',
  },
  noTransactions: {
    padding: 20,
    alignItems: 'center',
  },
  noTransactionsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  expensesSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  expensesContainer: {
    gap: 12,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  expenseCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  expenseDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ef4444',
  },
  exportSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  exportOptions: {
    gap: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  exportButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
});