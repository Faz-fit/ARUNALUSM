import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

const PunchInScreen = ({ route, navigation }) => {
  const { location, dateTime, selfieUri } = route.params;
  const [punchedIn, setPunchedIn] = useState(false);

  const handlePunchIn = () => {
    if (punchedIn) {
      Alert.alert('Already Punched In');
      return;
    }

    setPunchedIn(true);

    Alert.alert(
      'Punch In Successful',
      `Time: ${new Date(dateTime).toLocaleString()}\nLocation: ${location.latitude}, ${location.longitude}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // ✅ Navigate back to Location screen after confirmation
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review & Confirm</Text>

      <Text style={styles.text}>Latitude: {location.latitude}</Text>
      <Text style={styles.text}>Longitude: {location.longitude}</Text>
      <Text style={styles.text}>Date & Time: {new Date(dateTime).toLocaleString()}</Text>

      {selfieUri && (
        <Image
          source={{ uri: selfieUri }}
          style={styles.selfie}
        />
      )}

      <Button
        title={punchedIn ? 'Punched In' : 'Punch In'}
        onPress={handlePunchIn}
        disabled={punchedIn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  selfie: {
    width: 224,
    height: 224,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
});

export default PunchInScreen;
