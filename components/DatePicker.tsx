import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { CalendarDays, X } from 'lucide-react-native';

interface DatePickerProps {
  value: string;
  onDateChange: (date: string) => void;
  placeholder?: string;
  minimumDate?: string;
  maximumDate?: string;
  label?: string;
}

export function DatePicker({ 
  value, 
  onDateChange, 
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
  label 
}: DatePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateSelect = (day: any) => {
    onDateChange(day.dateString);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setModalVisible(true)}
      >
        <CalendarDays size={20} color="#64748b" />
        <Text style={[
          styles.dateText,
          !value && styles.placeholderText
        ]}>
          {formatDisplayDate(value)}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [value]: {
                  selected: true,
                  selectedColor: '#2563eb',
                  selectedTextColor: 'white'
                }
              }}
              minDate={minimumDate}
              maxDate={maximumDate}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#1e293b',
                selectedDayBackgroundColor: '#2563eb',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#2563eb',
                dayTextColor: '#1e293b',
                textDisabledColor: '#94a3b8',
                dotColor: '#2563eb',
                selectedDotColor: '#ffffff',
                arrowColor: '#2563eb',
                disabledArrowColor: '#94a3b8',
                monthTextColor: '#1e293b',
                indicatorColor: '#2563eb',
                textDayFontFamily: 'Inter-Regular',
                textMonthFontFamily: 'Inter-SemiBold',
                textDayHeaderFontFamily: 'Inter-SemiBold',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14
              }}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.todayButton}
                onPress={() => {
                  const today = new Date().toISOString().split('T')[0];
                  onDateChange(today);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  onDateChange('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
    flex: 1,
  },
  placeholderText: {
    color: '#94a3b8',
  },
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
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
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
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  todayButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  todayButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  clearButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});