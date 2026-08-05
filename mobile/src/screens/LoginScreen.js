import React, { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';
import { API_BASE } from '../config';
import { COLORS } from '../theme';
import TextField from '../components/TextField';
import AppButton from '../components/AppButton';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (e) {
      setError(getErrorMessage(e, 'Login failed. Check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../../assets/main.jpg')} style={styles.flex} resizeMode="cover">
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logoBox}>
            <Text style={styles.logo}>OM Medical</Text>
            <Text style={styles.tagline}>Advanced Clinical Portal</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Sign In</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextField
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="e.g. admin"
              autoCapitalize="none"
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              secureTextEntry
            />

            <AppButton title={loading ? 'Signing In...' : 'Sign In'} onPress={submit} disabled={loading} />

            <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>New user? Create an account</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>Backend: {API_BASE}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = {
  flex: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.62)' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoBox: { alignItems: 'center', marginBottom: 28 },
  logo: { fontSize: 30, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  tagline: { color: '#cbd5e1', marginTop: 6, fontSize: 14 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  error: {
    backgroundColor: COLORS.dangerBg,
    color: COLORS.danger,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  link: { alignItems: 'center', marginTop: 16 },
  linkText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  hint: { color: '#94a3b8', textAlign: 'center', marginTop: 24, fontSize: 11 },
};
