import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  // ✅ Manual JWT decoder
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('JWT decode error:', e);
      return null;
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://139.59.243.2:8000/api/token/', {
        username,
        password,
      });

      if (response.status === 200) {
        const accessToken = response.data.access;
        const refreshToken = response.data.refresh;

        // ✅ Manually decode the access token
        const decoded = decodeJWT(accessToken);
        console.log('Decoded JWT:', decoded);

        // Navigate to Home screen
        navigation.reset({
            index: 0,
            routes: [
                {
                name: 'Home',
                params: {
                    userId: decoded.user_id,
                    name: decoded.name,
                    role: decoded.role,
                },
                },
            ],
        });

      } else {
        setError('Unexpected server response');
      }
    } catch (err) {
      if (err.response) {
        setError('Login failed: ' + (err.response.data.detail || JSON.stringify(err.response.data)));
      } else if (err.request) {
        setError('Network error: No response from server');
      } else {
        setError('Login failed: ' + err.message);
      }
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        editable={!loading}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button
          title="Login"
          onPress={handleLogin}
          disabled={!username || !password}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});

export default LoginScreen;
