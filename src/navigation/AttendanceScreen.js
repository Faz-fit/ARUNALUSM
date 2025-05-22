import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const AttendanceScreen = ({ navigation }) => {
  const [punchedIn, setPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState(null);

  const handlePunchIn = () => {
    navigation.navigate('Location');
  };

  const handlePunchOutConfirm = () => {
    Alert.alert(
      'Confirm Punch Out',
      'Are you sure you want to punch out?',
      [
        {
          text: 'Yes',
          onPress: () => {
            setPunchedIn(false);
            alert('Punched Out at ' + new Date().toLocaleTimeString());
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Screen</Text>
      <Text style={styles.info}>
        {punchedIn
          ? `You are punched in since ${punchTime}`
          : 'Mark your attendance here.'}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Punch In"
          onPress={handlePunchIn}
        />
        <View style={{ margin: 10 }} />
        <Button
          title="Punch Out"
          onPress={handlePunchOutConfirm}
          disabled={!punchedIn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  info: { fontSize: 18, marginBottom: 16, textAlign: 'center' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default AttendanceScreen;
