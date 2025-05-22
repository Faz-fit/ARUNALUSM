import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { name, userId, role } = route.params || {};

  const handleAttendance = () => {
    navigation.navigate('Attendance');
  };

  const handleLeave = () => {
    navigation.navigate('Leave');
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {name || 'Guest'}!</Text>
      <Text style={styles.info}>User ID: {userId}</Text>
      <Text style={styles.info}>Role: {role}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Attendance" onPress={handleAttendance} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Leave" onPress={handleLeave} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Logout" color="#c0392b" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  info: { fontSize: 18, marginBottom: 8 },
  buttonContainer: { marginTop: 12, width: '60%' },
});

export default HomeScreen;
