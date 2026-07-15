import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function VitalsTracker() {
  const { authenticatedFetch, user } = useAuth();
  const [vitals, setVitals] = useState({
    blood_pressure: '',
    heart_rate: '',
    spo2: '',
    temperature: '',
    bmi: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setSuccess('');
    try {
      const payload = {
        ...vitals,
        heart_rate: vitals.heart_rate ? parseInt(vitals.heart_rate) : null,
        spo2: vitals.spo2 ? parseInt(vitals.spo2) : null,
        temperature: vitals.temperature ? parseFloat(vitals.temperature) : null,
        bmi: vitals.bmi ? parseFloat(vitals.bmi) : null,
      };

      const res = await authenticatedFetch('/api/tracker/vitals', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess('Vitals logged successfully!');
        setVitals({ blood_pressure: '', heart_rate: '', spo2: '', temperature: '', bmi: '' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vitals Tracker</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <HeartPulse size={32} color="#0EA5E9" />
          </View>
          <Text style={styles.cardTitle}>Log Today's Vitals</Text>

          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <Text style={styles.label}>Blood Pressure (e.g. 120/80)</Text>
          <TextInput
            style={styles.input}
            placeholder="mmHg"
            placeholderTextColor="#64748B"
            value={vitals.blood_pressure}
            onChangeText={t => setVitals({...vitals, blood_pressure: t})}
          />

          <Text style={styles.label}>Heart Rate</Text>
          <TextInput
            style={styles.input}
            placeholder="bpm"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            value={vitals.heart_rate}
            onChangeText={t => setVitals({...vitals, heart_rate: t})}
          />

          <Text style={styles.label}>SpO2 (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="%"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            value={vitals.spo2}
            onChangeText={t => setVitals({...vitals, spo2: t})}
          />

          <Text style={styles.label}>Temperature (°F)</Text>
          <TextInput
            style={styles.input}
            placeholder="°F"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            value={vitals.temperature}
            onChangeText={t => setVitals({...vitals, temperature: t})}
          />

          <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save Vitals</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    padding: 24, paddingTop: 60, backgroundColor: '#1E293B',
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#334155',
  },
  backBtn: { marginRight: 16 },
  headerTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  card: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  iconContainer: { alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', textAlign: 'center', marginBottom: 24 },
  label: { color: '#CBD5E1', fontSize: 14, marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155', borderRadius: 8,
    padding: 12, color: '#F8FAFC', marginBottom: 20, fontSize: 16,
  },
  btn: { backgroundColor: '#0EA5E9', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  successText: { color: '#10B981', textAlign: 'center', marginBottom: 16, fontWeight: '600' }
});
