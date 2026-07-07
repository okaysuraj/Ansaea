import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Stethoscope } from 'lucide-react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || 'Login failed');
      setLoading(false);
    }
    // if success, AuthContext handles navigation
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Stethoscope size={64} color="#0EA5E9" />
        <Text style={styles.title}>Ansaea Enterprise</Text>
        <Text style={styles.subtitle}>Digital Health Ecosystem</Text>
      </View>

      <View style={styles.formContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>Login hints for roles:</Text>
          <Text style={styles.hintText}>Doctor: doctor@ansaea.com</Text>
          <Text style={styles.hintText}>Admin: admin@ansaea.com</Text>
          <Text style={styles.hintText}>Lab: lab@ansaea.com</Text>
          <Text style={styles.hintText}>Pharmacy: pharm@ansaea.com</Text>
          <Text style={styles.hintText}>Patient: patient@ansaea.com</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: '#1E293B',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  label: {
    color: '#CBD5E1',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    color: '#F8FAFC',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0EA5E9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  hintBox: {
    marginTop: 32,
    padding: 16,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
  },
  hintText: {
    color: '#38BDF8',
    fontSize: 12,
    marginBottom: 4,
  }
});
