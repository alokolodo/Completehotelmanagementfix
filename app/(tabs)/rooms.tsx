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
import { Bed, Plus, Search, Eye, Clock, Users, DollarSign, Wrench, Filter } from 'lucide-react-native';

type Room = Database['public']['Tables']['rooms']['Row'];

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<Room['status'] | 'all'>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const roomsData = await db.select<Room>('rooms');
      setRooms(roomsData);
    } catch (error) {
      console.error('Error loading rooms:', error);
      Alert.alert('Error', 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const updateRoomStatus = async (roomId: string, status: Room['status']) => {
    try {
      await db.update<Room>('rooms', roomId, { status });
      setRooms(rooms.map(room => 
        room.id === roomId ? { ...room, status } : room
      ));
      Alert.alert('Success', 'Room status updated');
    } catch (error) {
      console.error('Error updating room status:', error);
      Alert.alert('Error', 'Failed to update room status');
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadRooms();
    setRefreshing(false);
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.room_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available': return '#059669';
      case 'occupied': return '#dc2626';
      case 'maintenance': return '#ea580c';
      case 'cleaning': return '#2563eb';
      case 'reserved': return '#7c3aed';
      case 'out_of_order': return '#64748b';
      default: return '#64748b';
    }
  };

  const getRoomTypeColor = (type: Room['room_type']) => {
    switch (type) {
      case 'standard': return '#64748b';
      case 'deluxe': return '#2563eb';
      case 'suite': return '#7c3aed';
      case 'presidential': return '#dc2626';
      case 'family': return '#059669';
      case 'executive': return '#ea580c';
      default: return '#64748b';
    }
  };

  const statusOptions: Room['status'][] = ['available', 'occupied', 'maintenance', 'cleaning', 'reserved', 'out_of_order'];

  return (
    <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.pageTitle}>Rooms Management</Text>
            <Text style={styles.pageSubtitle}>Monitor and manage hotel rooms</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color="#ffffff" />
              <Text style={styles.addButtonText}>Add Room</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters and Search */}
        <View style={styles.filtersSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search rooms..."
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
                  All ({rooms.length})
                </Text>
              </TouchableOpacity>
              {statusOptions.map((status) => {
                const count = rooms.filter(r => r.status === status).length;
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

        {/* Rooms Grid */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.roomsGrid}>
            {filteredRooms.map((room) => (
              <TouchableOpacity
                key={room.id}
                style={styles.roomCard}
                onPress={() => {
                  setSelectedRoom(room);
                  setModalVisible(true);
                }}
              >
                <View style={styles.roomHeader}>
                  <View style={styles.roomNumberContainer}>
                    <Text style={styles.roomNumber}>{room.room_number}</Text>
                    <View style={[styles.roomTypeBadge, { backgroundColor: getRoomTypeColor(room.room_type) }]}>
                      <Text style={styles.roomTypeText}>
                        {room.room_type.charAt(0).toUpperCase() + room.room_type.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(room.status) }]}>
                    <Text style={styles.statusText}>
                      {room.status.replace('_', ' ').charAt(0).toUpperCase() + room.status.replace('_', ' ').slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.roomDetails}>
                  <View style={styles.roomDetailRow}>
                    <DollarSign size={16} color="#64748b" />
                    <Text style={styles.roomDetailText}>${room.price_per_night}/night</Text>
                  </View>
                  <View style={styles.roomDetailRow}>
                    <Users size={16} color="#64748b" />
                    <Text style={styles.roomDetailText}>Max: {room.max_occupancy} guests</Text>
                  </View>
                  <View style={styles.roomDetailRow}>
                    <Clock size={16} color="#64748b" />
                    <Text style={styles.roomDetailText}>Floor: {room.floor}</Text>
                  </View>
                </View>

                <View style={styles.roomActions}>
                  {room.status === 'occupied' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#2563eb' }]}
                      onPress={() => updateRoomStatus(room.id, 'cleaning')}
                    >
                      <Text style={styles.actionButtonText}>Check Out</Text>
                    </TouchableOpacity>
                  )}

                  {room.status === 'cleaning' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#059669' }]}
                      onPress={() => updateRoomStatus(room.id, 'available')}
                    >
                      <Text style={styles.actionButtonText}>Clean Done</Text>
                    </TouchableOpacity>
                  )}

                  {room.status === 'available' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#dc2626' }]}
                      onPress={() => updateRoomStatus(room.id, 'occupied')}
                    >
                      <Text style={styles.actionButtonText}>Check In</Text>
                    </TouchableOpacity>
                  )}

                  {room.status === 'maintenance' && (
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#059669' }]}
                      onPress={() => updateRoomStatus(room.id, 'available')}
                    >
                      <Text style={styles.actionButtonText}>Fixed</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

      {/* Room Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedRoom && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Room {selectedRoom.room_number}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Room Information</Text>
                    <View style={styles.infoGrid}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Type</Text>
                        <Text style={styles.infoValue}>{selectedRoom.room_type.charAt(0).toUpperCase() + selectedRoom.room_type.slice(1)}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Floor</Text>
                        <Text style={styles.infoValue}>{selectedRoom.floor}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Max Occupancy</Text>
                        <Text style={styles.infoValue}>{selectedRoom.max_occupancy} guests</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Price per Night</Text>
                        <Text style={styles.infoValue}>${selectedRoom.price_per_night}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Current Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedRoom.status) }]}>
                      <Text style={styles.statusText}>
                        {selectedRoom.status.replace('_', ' ').charAt(0).toUpperCase() + selectedRoom.status.replace('_', ' ').slice(1)}
                      </Text>
                    </View>
                  </View>

                  {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.sectionTitle}>Amenities</Text>
                      <View style={styles.amenitiesContainer}>
                        {selectedRoom.amenities.map((amenity, index) => (
                          <View key={index} style={styles.amenityTag}>
                            <Text style={styles.amenityText}>{amenity}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Change Status</Text>
                    <View style={styles.statusButtonsContainer}>
                      {statusOptions.map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.modalStatusButton,
                            selectedRoom.status === status && styles.modalStatusButtonActive,
                          ]}
                          onPress={() => {
                            updateRoomStatus(selectedRoom.id, status);
                            setSelectedRoom({ ...selectedRoom, status });
                          }}
                        >
                          <Text style={[
                            styles.modalStatusButtonText,
                            selectedRoom.status === status && styles.modalStatusButtonTextActive,
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
  roomsGrid: {
    padding: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  roomCard: {
    width: 280,
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
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  roomNumberContainer: {
    flex: 1,
  },
  roomNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  roomTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  roomTypeText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  roomDetails: {
    gap: 12,
    marginBottom: 20,
  },
  roomDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roomDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  roomActions: {
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
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: 120,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  amenityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2563eb',
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
});