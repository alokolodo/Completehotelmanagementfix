import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '@/lib/database';
import { Database } from '@/types/database';
import { Calendar, Search, Plus, User, MapPin, CreditCard, Clock, Phone, Mail, Filter } from 'lucide-react-native';

type Booking = Database['public']['Tables']['bookings']['Row'];
type Room = Database['public']['Tables']['rooms']['Row'];

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<Booking['booking_status'] | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBookingModal, setNewBookingModal] = useState(false);

  const [newBooking, setNewBooking] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    guest_id_number: '',
    room_id: '',
    check_in: '',
    check_out: '',
    total_amount: 0,
    deposit_amount: 0,
    adults: 1,
    children: 0,
    special_requests: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, roomsData] = await Promise.all([
        db.select<Booking>('bookings'),
        db.select<Room>('rooms')
      ]);
      setBookings(bookingsData);
      setRooms(roomsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load bookings data');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async () => {
    if (!newBooking.guest_name || !newBooking.guest_email || !newBooking.room_id || 
        !newBooking.check_in || !newBooking.check_out) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const booking = await db.insert<Booking>('bookings', {
        ...newBooking,
        payment_status: 'pending',
        booking_status: 'confirmed',
        checkout_time: '12:00',
      });

      // Update room status to reserved
      await db.update<Room>('rooms', newBooking.room_id, { status: 'reserved' });

      Alert.alert('Success', 'Booking created successfully');
      setNewBookingModal(false);
      setNewBooking({
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        guest_id_number: '',
        room_id: '',
        check_in: '',
        check_out: '',
        total_amount: 0,
        deposit_amount: 0,
        adults: 1,
        children: 0,
        special_requests: '',
      });
      loadData();
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'Failed to create booking');
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['booking_status']) => {
    try {
      await db.update<Booking>('bookings', bookingId, { booking_status: status });
      
      // Update room status based on booking status
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        let roomStatus: Room['status'] = 'available';
        switch (status) {
          case 'checked_in':
            roomStatus = 'occupied';
            break;
          case 'checked_out':
            roomStatus = 'cleaning';
            break;
          case 'cancelled':
            roomStatus = 'available';
            break;
          case 'confirmed':
            roomStatus = 'reserved';
            break;
        }
        await db.update<Room>('rooms', booking.room_id, { status: roomStatus });
      }

      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, booking_status: status } : booking
      ));

      Alert.alert('Success', 'Booking status updated');
    } catch (error) {
      console.error('Error updating booking status:', error);
      Alert.alert('Error', 'Failed to update booking status');
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.guest_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.booking_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Booking['booking_status']) => {
    switch (status) {
      case 'confirmed': return '#ea580c';
      case 'checked_in': return '#059669';
      case 'checked_out': return '#64748b';
      case 'cancelled': return '#dc2626';
      case 'no_show': return '#7c3aed';
      default: return '#64748b';
    }
  };

  const getPaymentStatusColor = (status: Booking['payment_status']) => {
    switch (status) {
      case 'paid': return '#059669';
      case 'partial': return '#ea580c';
      case 'pending': return '#dc2626';
      case 'refunded': return '#64748b';
      case 'overdue': return '#dc2626';
      default: return '#64748b';
    }
  };

  const getRoomInfo = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? `Room ${room.room_number} (${room.room_type})` : 'Unknown Room';
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const statusOptions: Booking['booking_status'][] = ['confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'];

  return (
    <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.pageTitle}>Bookings Management</Text>
            <Text style={styles.pageSubtitle}>Manage guest reservations and check-ins</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setNewBookingModal(true)}
            >
              <Plus size={20} color="#ffffff" />
              <Text style={styles.addButtonText}>New Booking</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters and Search */}
        <View style={styles.filtersSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search bookings..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94a3b8"
            />
          </View>
          
          <View style={styles.filterContainer}>
            <Filter size={16} color="#64748b" />
            <Text style={styles.filterLabel}>Filter:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity
                style={[styles.filterButton, filterStatus === 'all' && styles.filterButtonActive]}
                onPress={() => setFilterStatus('all')}
              >
                <Text style={[styles.filterButtonText, filterStatus === 'all' && styles.filterButtonTextActive]}>
                  All ({bookings.length})
                </Text>
              </TouchableOpacity>
              {statusOptions.map((status) => {
                const count = bookings.filter(b => b.booking_status === status).length;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[styles.filterButton, filterStatus === status && styles.filterButtonActive]}
                    onPress={() => setFilterStatus(status)}
                  >
                    <Text style={[styles.filterButtonText, filterStatus === status && styles.filterButtonTextActive]}>
                      {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Bookings List */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.bookingsContainer}>
            {filteredBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                style={styles.bookingCard}
                onPress={() => {
                  setSelectedBooking(booking);
                  setModalVisible(true);
                }}
              >
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingInfo}>
                    <Text style={styles.guestName}>{booking.guest_name}</Text>
                    <Text style={styles.roomInfo}>{getRoomInfo(booking.room_id)}</Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.booking_status) }]}>
                      <Text style={styles.statusText}>
                        {booking.booking_status.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                    <View style={[styles.paymentBadge, { backgroundColor: getPaymentStatusColor(booking.payment_status) }]}>
                      <Text style={styles.statusText}>
                        {booking.payment_status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.bookingDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color="#64748b" />
                    <Text style={styles.detailText}>
                      {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Clock size={16} color="#64748b" />
                    <Text style={styles.detailText}>
                      {calculateNights(booking.check_in, booking.check_out)} nights
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <CreditCard size={16} color="#64748b" />
                    <Text style={styles.detailText}>${booking.total_amount}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <User size={16} color="#64748b" />
                    <Text style={styles.detailText}>
                      {booking.adults} adult{booking.adults !== 1 ? 's' : ''}{booking.children > 0 ? `, ${booking.children} child${booking.children !== 1 ? 'ren' : ''}` : ''}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  {booking.booking_status === 'confirmed' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#059669' }]}
                      onPress={() => updateBookingStatus(booking.id, 'checked_in')}
                    >
                      <Text style={styles.actionButtonText}>Check In</Text>
                    </TouchableOpacity>
                  )}

                  {booking.booking_status === 'checked_in' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#ea580c' }]}
                      onPress={() => updateBookingStatus(booking.id, 'checked_out')}
                    >
                      <Text style={styles.actionButtonText}>Check Out</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

      {/* Booking Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBooking && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Booking Details</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Guest Information</Text>
                    <View style={styles.infoRow}>
                      <User size={16} color="#64748b" />
                      <Text style={styles.infoText}>{selectedBooking.guest_name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Mail size={16} color="#64748b" />
                      <Text style={styles.infoText}>{selectedBooking.guest_email}</Text>
                    </View>
                    {selectedBooking.guest_phone && (
                      <View style={styles.infoRow}>
                        <Phone size={16} color="#64748b" />
                        <Text style={styles.infoText}>{selectedBooking.guest_phone}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Booking Information</Text>
                    <View style={styles.infoRow}>
                      <MapPin size={16} color="#64748b" />
                      <Text style={styles.infoText}>{getRoomInfo(selectedBooking.room_id)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Calendar size={16} color="#64748b" />
                      <Text style={styles.infoText}>
                        {new Date(selectedBooking.check_in).toLocaleDateString()} - {new Date(selectedBooking.check_out).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <CreditCard size={16} color="#64748b" />
                      <Text style={styles.infoText}>Total: ${selectedBooking.total_amount}</Text>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Status Management</Text>
                    <View style={styles.statusButtonsContainer}>
                      {statusOptions.map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.modalStatusButton,
                            selectedBooking.booking_status === status && styles.modalStatusButtonActive,
                          ]}
                          onPress={() => {
                            updateBookingStatus(selectedBooking.id, status);
                            setSelectedBooking({ ...selectedBooking, booking_status: status });
                          }}
                        >
                          <Text style={[
                            styles.modalStatusButtonText,
                            selectedBooking.booking_status === status && styles.modalStatusButtonTextActive,
                          ]}>
                            {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* New Booking Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={newBookingModal}
        onRequestClose={() => setNewBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Booking</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setNewBookingModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Guest Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={newBooking.guest_name}
                  onChangeText={(text) => setNewBooking({ ...newBooking, guest_name: text })}
                  placeholder="Enter guest name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Guest Email *</Text>
                <TextInput
                  style={styles.formInput}
                  value={newBooking.guest_email}
                  onChangeText={(text) => setNewBooking({ ...newBooking, guest_email: text })}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity style={styles.createButton} onPress={createBooking}>
                <Text style={styles.createButtonText}>Create Booking</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  filtersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    minWidth: 300,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  filterScroll: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  bookingsContainer: {
    padding: 24,
    gap: 16,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  guestName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  roomInfo: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563eb',
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  bookingDetails: {
    gap: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
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
  modalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalStatusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalStatusButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  modalStatusButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  modalStatusButtonTextActive: {
    color: '#ffffff',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#fafafa',
  },
  createButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});