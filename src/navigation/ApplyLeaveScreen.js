import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar, CalendarList, LocaleConfig } from 'react-native-calendars';

// Sample available leave counts
const availableLeaves = {
  'Sick Leave': 5,
  'Casual Leave': 3,
  'Earned Leave': 7,
  'Special Leave': null, // Unlimited
};

const ApplyLeaveScreen = () => {
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});

  const handleDateSelect = (date) => {
    if (leaveType !== 'Special Leave') {
      // Limit date selection based on leave count
      const count = Object.keys(selectedDates).length;
      if (selectedDates[date]) {
        // Deselect if already selected
        const updatedDates = { ...selectedDates };
        delete updatedDates[date];
        setSelectedDates(updatedDates);
      } else if (count < availableLeaves[leaveType]) {
        setSelectedDates({ ...selectedDates, [date]: { selected: true, marked: true } });
      } else {
        alert(`You can only select up to ${availableLeaves[leaveType]} days for ${leaveType}`);
      }
    } else {
      // No limit for Special Leave
      const updatedDates = { ...selectedDates };
      if (updatedDates[date]) {
        delete updatedDates[date];
      } else {
        updatedDates[date] = { selected: true, marked: true };
      }
      setSelectedDates(updatedDates);
    }
  };

  const handleApplyLeave = () => {
    if (!Object.keys(selectedDates).length) {
      alert('Please select at least one date.');
      return;
    }
    if (leaveType === 'Special Leave' && !reason) {
      alert('Please provide a reason for Special Leave.');
      return;
    }

    setLoading(true);
    console.log('Applying Leave:', { leaveType, selectedDates, reason });

    setTimeout(() => {
      setLoading(false);
      alert('Leave application submitted successfully!');
      // Reset state
      setSelectedDates({});
      setReason('');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apply for Leave</Text>

      <Text style={styles.label}>Select Leave Type</Text>
      <Picker
        selectedValue={leaveType}
        onValueChange={(itemValue) => {
          setLeaveType(itemValue);
          setSelectedDates({});
          setReason('');
        }}
        style={styles.picker}
      >
        <Picker.Item label="Casual Leave" value="Casual Leave" />
        <Picker.Item label="Sick Leave" value="Sick Leave" />
        <Picker.Item label="Earned Leave" value="Earned Leave" />
        <Picker.Item label="Special Leave" value="Special Leave" />
      </Picker>

      <Text style={styles.label}>Select Date(s)</Text>
      <Calendar
        onDayPress={(day) => handleDateSelect(day.dateString)}
        markedDates={selectedDates}
        markingType="multi-dot"
      />

      {leaveType === 'Special Leave' && (
        <>
          <Text style={styles.label}>Reason for Special Leave</Text>
          <TextInput
            style={styles.input}
            value={reason}
            onChangeText={setReason}
            placeholder="Enter reason for leave"
            multiline
          />
        </>
      )}

      <Button
        title={loading ? 'Submitting...' : 'Submit Leave Application'}
        onPress={handleApplyLeave}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  picker: { height: 50, width: '100%', marginBottom: 20 },
  input: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    textAlignVertical: 'top',
  },
});

export default ApplyLeaveScreen;
