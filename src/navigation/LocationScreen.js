import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, StyleSheet, PermissionsAndroid, Alert, ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const LocationScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location for punch-in.',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        setErrorMsg('Location permission denied');
      }
    } catch (err) {
      setErrorMsg('Permission error: ' + err);
    }
  };

  const getCurrentLocation = () => {
    setLoadingLocation(true);
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setDateTime(new Date());
        setLoadingLocation(false);
      },
      (error) => {
        setErrorMsg('Location error: ' + error.message);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleNext = () => {
    if (!location) {
      Alert.alert('Error', 'Location not available.');
      return;
    }
    navigation.navigate('Selfie', {
      location,
      dateTime: dateTime.toString(),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Details</Text>

      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : loadingLocation ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : location ? (
        <>
          <Text style={styles.text}>Latitude: {location.latitude}</Text>
          <Text style={styles.text}>Longitude: {location.longitude}</Text>
          <Text style={styles.text}>Date & Time: {dateTime.toLocaleString()}</Text>
        </>
      ) : (
        <Text style={styles.text}>Fetching location...</Text>
      )}

      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, marginBottom: 8 },
  error: { fontSize: 16, color: 'red', marginBottom: 8 },
});

export default LocationScreen;
