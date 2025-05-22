import React, { useState } from 'react';
import {
  View, Text, Button, Image, StyleSheet, Alert, PermissionsAndroid,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

const SelfieScreen = ({ route, navigation }) => {
  const { location, dateTime } = route.params;
  const [selfieUri, setSelfieUri] = useState(null);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission to take a selfie.',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      Alert.alert('Permission Error', err.message);
      return false;
    }
  };

  const handleTakeSelfie = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'front',
        includeBase64: false,
      },
      async (response) => {
        const asset = response?.assets?.[0];
        if (!asset?.uri) {
          Alert.alert('Error', 'Failed to capture selfie.');
          return;
        }

        try {
          const resizedImage = await ImageResizer.createResizedImage(
            asset.uri,
            224,
            224,
            'JPEG',
            100
          );
          setSelfieUri(resizedImage.uri);
        } catch (error) {
          Alert.alert('Error', 'Could not resize image');
        }
      }
    );
  };

  const handleNext = () => {
    if (!selfieUri) {
      Alert.alert('Error', 'Please take a selfie before proceeding.');
      return;
    }

    navigation.navigate('PunchIn', {
      location,
      dateTime,
      selfieUri,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selfie & Punch Info</Text>

      <Text style={styles.text}>Latitude: {location.latitude}</Text>
      <Text style={styles.text}>Longitude: {location.longitude}</Text>
      <Text style={styles.text}>Date & Time: {new Date(dateTime).toLocaleString()}</Text>

      <Button title="Take Selfie" onPress={handleTakeSelfie} />

      {selfieUri && <Image source={{ uri: selfieUri }} style={styles.selfie} />}

      <View style={{ marginTop: 16 }}>
        <Button title="Next" onPress={handleNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, marginBottom: 8 },
  selfie: {
    width: 224,
    height: 224,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
});

export default SelfieScreen;
