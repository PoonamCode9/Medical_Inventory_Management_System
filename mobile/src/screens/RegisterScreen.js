import React, { useState } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';
import { ROLES, ROLE_LABEL } from '../constants';
import { COLORS } from '../theme';
import TextField from '../components/TextField';
import AppButton from '../components/AppButton';
import Select from '../components/Select';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('STAFF');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      await register({ name, username, password, role, email });
      Alert.alert('Registered!', 'You can now sign in.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      setError(getErrorMessage(e, 'Registration failed.'));
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
            <Text style={styles.logo}>Create Account</Text>
            <Text style={styles.tagline}>Join OM Medical Portal</Text>
          </View>

          <View style={styles.card}>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextField label="Full Name" value={name} onChangeText={setName} placeholder="e.g. Dr. John Smith" />
            <TextField label="Username" value={username} onChangeText={setUsername} placeholder="e.g. drsmith" autoCapitalize="none" />
            <TextField label="Password" value={password} onChangeText={setPassword} placeholder="••••••" secureTextEntry />
            <TextField label="Email" value={email} onChangeText={setEmail} placeholder="e.g. drsmith@hospital.com" keyboardType="email-address" />

            <Select
              label="Role"
              value={role}
              options={ROLES.map((r) => ({ value: r, label: ROLE_LABEL(r) }))}
              onChange={setRole}
            />

            <AppButton title={loading ? 'Creating Account...' : 'Create Account'} onPress={submit} disabled={loading} color={COLORS.primary} />
          </View>
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
  logo: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
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
  error: {
    backgroundColor: COLORS.dangerBg,
    color: COLORS.danger,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
};
