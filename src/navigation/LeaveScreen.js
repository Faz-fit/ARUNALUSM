import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const leaveData = [
  { id: '1', name: 'Casual Leave', count: 5 },
  { id: '2', name: 'Sick Leave', count: 2 },
  { id: '3', name: 'Earned Leave', count: 10 },
];

const leaveHistoryData = [
  { id: 'h1', date: '2025-05-01', type: 'Casual Leave', status: 'Approved' },
  { id: 'h2', date: '2025-04-15', type: 'Sick Leave', status: 'Rejected' },
  { id: 'h3', date: '2025-03-20', type: 'Earned Leave', status: 'Approved' },
];

const LeaveScreen = () => {
  const navigation = useNavigation();

  const renderLeaveItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.count}</Text>
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyRow}>
      <Text>{item.date}</Text>
      <Text>{item.type}</Text>
      <Text>{item.status}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Available Leaves</Text>

      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerCell]}>Leave Name</Text>
        <Text style={[styles.cell, styles.headerCell]}>Count</Text>
      </View>

      <FlatList
        data={leaveData}
        keyExtractor={item => item.id}
        renderItem={renderLeaveItem}
        style={{ marginBottom: 20 }}
      />

      <Text style={styles.title}>Leave History</Text>

      <FlatList
        data={leaveHistoryData}
        keyExtractor={item => item.id}
        renderItem={renderHistoryItem}
        style={{ marginBottom: 20 }}
      />

      <Button
        title="Apply Leave"
        onPress={() => navigation.navigate('ApplyLeave')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#ccc' },
  headerRow: { backgroundColor: '#f0f0f0' },
  cell: { flex: 1, fontSize: 16 },
  headerCell: { fontWeight: 'bold' },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#ddd' },
});

export default LeaveScreen;
