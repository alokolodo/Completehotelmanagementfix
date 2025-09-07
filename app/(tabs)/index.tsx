import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthContext } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { db } from '@/lib/database';
import { 
  Bed, 
  Users, 
  DollarSign, 
  Calendar, 
  ChefHat, 
  Wine, 
  TrendingUp, 
  TriangleAlert as AlertTriangle,
  Building,
  Waves,
  Wrench,
  Package,
  Clock,
  CreditCard,
  Star
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  pendingOrders: number;
  lowStockItems: number;
  todayRevenue: number;
  monthlyRevenue: number;
  maintenanceRequests: number;
  hallBookings: number;
}

export default function Dashboard() {
  const { user } = useAuthContext();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get dashboard statistics
      const dashboardStats = await db.getDashboardStats();
      
      // Get additional stats
      const maintenanceRequests = await db.select('maintenance_requests', { status: 'pending' });
      const hallBookings = await db.select('hall_bookings');
      const todayHallBookings = hallBookings.filter(booking => {
        const today = new Date().toISOString().split('T')[0];
        return booking.start_datetime.startsWith(today);
      });

      const finalStats: DashboardStats = {
        ...dashboardStats,
        maintenanceRequests: maintenanceRequests.length,
        hallBookings: todayHallBookings.length,
      };

      setStats(finalStats);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (!stats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load dashboard data</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDashboardData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const occupancyRate = stats.totalRooms > 0 ? ((stats.occupiedRooms / stats.totalRooms) * 100).toFixed(1) : '0';

  return (
    <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.pageTitle}>Dashboard</Text>
            <Text style={styles.pageSubtitle}>Hotel Management Overview</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.currentDate}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Text style={styles.currentTime}>
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Stats Row */}
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStatCard}>
              <View style={styles.quickStatIcon}>
                <Bed size={24} color="#2563eb" />
              </View>
              <View style={styles.quickStatInfo}>
                <Text style={styles.quickStatNumber}>{stats.occupiedRooms}/{stats.totalRooms}</Text>
                <Text style={styles.quickStatLabel}>Rooms Occupied</Text>
              </View>
            </View>

            <View style={styles.quickStatCard}>
              <View style={styles.quickStatIcon}>
                <Calendar size={24} color="#059669" />
              </View>
              <View style={styles.quickStatInfo}>
                <Text style={styles.quickStatNumber}>{stats.todayCheckIns}</Text>
                <Text style={styles.quickStatLabel}>Check-ins Today</Text>
              </View>
            </View>

            <View style={styles.quickStatCard}>
              <View style={styles.quickStatIcon}>
                <DollarSign size={24} color="#dc2626" />
              </View>
              <View style={styles.quickStatInfo}>
                <Text style={styles.quickStatNumber}>${stats.todayRevenue.toLocaleString()}</Text>
                <Text style={styles.quickStatLabel}>Today's Revenue</Text>
              </View>
            </View>

            <View style={styles.quickStatCard}>
              <View style={styles.quickStatIcon}>
                <ChefHat size={24} color="#7c3aed" />
              </View>
              <View style={styles.quickStatInfo}>
                <Text style={styles.quickStatNumber}>{stats.pendingOrders}</Text>
                <Text style={styles.quickStatLabel}>Pending Orders</Text>
              </View>
            </View>
          </View>

          {/* Main Dashboard Grid */}
          <View style={styles.dashboardGrid}>
            {/* Occupancy Chart */}
            <View style={styles.chartCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Room Occupancy</Text>
                <Text style={styles.cardSubtitle}>Current Status</Text>
              </View>
              <View style={styles.occupancyDisplay}>
                <View style={styles.occupancyCircle}>
                  <Text style={styles.occupancyPercentage}>{occupancyRate}%</Text>
                  <Text style={styles.occupancyLabel}>Occupied</Text>
                </View>
                <View style={styles.occupancyStats}>
                  <View style={styles.occupancyStat}>
                    <View style={[styles.occupancyDot, { backgroundColor: '#2563eb' }]} />
                    <Text style={styles.occupancyStatText}>Occupied: {stats.occupiedRooms}</Text>
                  </View>
                  <View style={styles.occupancyStat}>
                    <View style={[styles.occupancyDot, { backgroundColor: '#059669' }]} />
                    <Text style={styles.occupancyStatText}>Available: {stats.availableRooms}</Text>
                  </View>
                  <View style={styles.occupancyStat}>
                    <View style={[styles.occupancyDot, { backgroundColor: '#dc2626' }]} />
                    <Text style={styles.occupancyStatText}>Maintenance: {stats.totalRooms - stats.occupiedRooms - stats.availableRooms}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Revenue Chart */}
            <View style={styles.chartCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Revenue Overview</Text>
                <Text style={styles.cardSubtitle}>Monthly Performance</Text>
              </View>
              <View style={styles.revenueDisplay}>
                <Text style={styles.revenueAmount}>${stats.monthlyRevenue.toLocaleString()}</Text>
                <Text style={styles.revenueLabel}>This Month</Text>
                <View style={styles.revenueTrend}>
                  <TrendingUp size={16} color="#059669" />
                  <Text style={styles.revenueTrendText}>+12.5% from last month</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Quick Actions</Text>
                <Text style={styles.cardSubtitle}>Common Tasks</Text>
              </View>
              <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.actionButton}>
                  <Calendar size={20} color="#2563eb" />
                  <Text style={styles.actionButtonText}>New Booking</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Users size={20} color="#059669" />
                  <Text style={styles.actionButtonText}>Check In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <ChefHat size={20} color="#dc2626" />
                  <Text style={styles.actionButtonText}>Restaurant</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Package size={20} color="#7c3aed" />
                  <Text style={styles.actionButtonText}>Inventory</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Alerts & Notifications */}
            <View style={styles.alertsCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Alerts & Notifications</Text>
                <Text style={styles.cardSubtitle}>Requires Attention</Text>
              </View>
              <View style={styles.alertsList}>
                {stats.lowStockItems > 0 && (
                  <View style={styles.alertItem}>
                    <AlertTriangle size={16} color="#dc2626" />
                    <Text style={styles.alertText}>{stats.lowStockItems} items low in stock</Text>
                  </View>
                )}
                {stats.maintenanceRequests > 0 && (
                  <View style={styles.alertItem}>
                    <Wrench size={16} color="#ea580c" />
                    <Text style={styles.alertText}>{stats.maintenanceRequests} maintenance requests pending</Text>
                  </View>
                )}
                {stats.todayCheckOuts > 0 && (
                  <View style={styles.alertItem}>
                    <Clock size={16} color="#2563eb" />
                    <Text style={styles.alertText}>{stats.todayCheckOuts} guests checking out today</Text>
                  </View>
                )}
                {stats.hallBookings > 0 && (
                  <View style={styles.alertItem}>
                    <Building size={16} color="#7c3aed" />
                    <Text style={styles.alertText}>{stats.hallBookings} hall events today</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.activityCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Recent Activity</Text>
                <Text style={styles.cardSubtitle}>Latest Updates</Text>
              </View>
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Calendar size={14} color="#2563eb" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>New booking received for Room 205</Text>
                    <Text style={styles.activityTime}>2 minutes ago</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <ChefHat size={14} color="#059669" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>Restaurant order completed - Table 8</Text>
                    <Text style={styles.activityTime}>5 minutes ago</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Users size={14} color="#dc2626" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>Guest checked out from Room 102</Text>
                    <Text style={styles.activityTime}>12 minutes ago</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* System Status */}
            <View style={styles.statusCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>System Status</Text>
                <Text style={styles.cardSubtitle}>All Systems</Text>
              </View>
              <View style={styles.statusList}>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { backgroundColor: '#059669' }]} />
                  <Text style={styles.statusText}>Database: Online</Text>
                </View>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { backgroundColor: '#059669' }]} />
                  <Text style={styles.statusText}>Payment System: Active</Text>
                </View>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { backgroundColor: '#ea580c' }]} />
                  <Text style={styles.statusText}>Backup: Scheduled</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  pageSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  currentDate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  currentTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  quickStatsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 20,
  },
  quickStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  quickStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStatInfo: {
    flex: 1,
  },
  quickStatNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  quickStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  dashboardGrid: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chartCard: {
    width: (width - 280 - 48 - 24) / 2, // Account for sidebar, padding, and gap
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  actionsCard: {
    width: (width - 280 - 48 - 24) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  alertsCard: {
    width: (width - 280 - 48 - 24) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  activityCard: {
    width: (width - 280 - 48 - 24) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  statusCard: {
    width: (width - 280 - 48 - 24) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  occupancyDisplay: {
    alignItems: 'center',
  },
  occupancyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  occupancyPercentage: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2563eb',
  },
  occupancyLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  occupancyStats: {
    gap: 8,
    alignSelf: 'stretch',
  },
  occupancyStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  occupancyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  occupancyStatText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  revenueDisplay: {
    alignItems: 'center',
  },
  revenueAmount: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  revenueLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 16,
  },
  revenueTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  revenueTrendText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  alertsList: {
    gap: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },
  alertText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7f1d1d',
    flex: 1,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  statusList: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});