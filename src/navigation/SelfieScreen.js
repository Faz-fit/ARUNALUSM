import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  Alert,
  PermissionsAndroid,
  StyleSheet,
} from "react-native";
import { launchCamera } from "react-native-image-picker";
import MLKitFaceDetection from "react-native-mlkit-face-detection";
import { ImageEditor } from "react-native";

export default function App() {
  const [croppedFaceUri, setCroppedFaceUri] = useState(null);

  async function requestCameraPermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera Permission",
        message: "We need camera access to take your selfie",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  async function handleTakeSelfie() {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    launchCamera(
      { mediaType: "photo", cameraType: "front" },
      async (response) => {
        const asset = response?.assets?.[0];
        if (!asset?.uri) {
          Alert.alert("Error", "Could not capture selfie");
          return;
        }

        try {
          const faces = await MLKitFaceDetection.detectFromFile(asset.uri);
          if (!faces.length) {
            Alert.alert("No face detected, try again");
            return;
          }

          const faceBounds = faces[0].bounds;

          ImageEditor.cropImage(
            asset.uri,
            {
              offset: { x: faceBounds.origin.x, y: faceBounds.origin.y },
              size: { width: faceBounds.size.width, height: faceBounds.size.height },
              displaySize: { width: 224, height: 224 },
              resizeMode: "contain",
            },
            (croppedUri) => setCroppedFaceUri(croppedUri),
            (error) => Alert.alert("Crop error", error.message)
          );
        } catch (error) {
          Alert.alert("Face detection failed", error.message);
        }
      }
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Take Selfie" onPress={handleTakeSelfie} />
      {croppedFaceUri && <Image source={{ uri: croppedFaceUri }} style={styles.face} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  face: { width: 224, height: 224, marginTop: 20, borderRadius: 8 },
});
