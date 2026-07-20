import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Activity, Heart, Brain, Calendar } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

export default function PatientDashboard() {
  const { user, authenticatedFetch } = useAuth();
  const [latestVitals, setLatestVitals] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVitals = async () => {
    try {
      const res = await authenticatedFetch('/api/tracker/vitals');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setLatestVitals(data[0]);
        } else {
          setLatestVitals(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVitals();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchVitals();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0ea5e9" />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Hello, {user?.username || 'Patient'}</Text>
          <Text style={styles.subtitle}>Let's check in on your health today.</Text>
        </View>

        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Activity size={20} color="#0ea5e9" />
            <Text style={styles.cardTitle}>Daily Vitals</Text>
          </View>
          {latestVitals ? (
            <>
              <Text style={styles.cardDesc}>Heart Rate: {latestVitals.heart_rate || '--'} BPM</Text>
              <Text style={styles.cardDesc}>SpO2: {latestVitals.spo2 || '--'}%</Text>
            </>
          ) : (
            <Text style={styles.cardDesc}>No vitals logged recently.</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={() => router.push('/(patient)/vitals')}>
            <Text style={styles.buttonText}>Log Vitals</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={[styles.card, { flex: 1, marginRight: 8 }]}>
            <Heart size={20} color="#ef4444" style={{ marginBottom: 8 }} />
            <Text style={styles.cardTitle}>Self-Care</Text>
            <Text style={styles.cardDesc}>2 tasks pending</Text>
          </View>
          <View style={[styles.card, { flex: 1, marginLeft: 8 }]}>
            <Brain size={20} color="#8b5cf6" style={{ marginBottom: 8 }} />
            <Text style={styles.cardTitle}>Mood</Text>
            <Text style={styles.cardDesc}>Log today's mood</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Calendar size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Upcoming Consultations</Text>
          </View>
          <Text style={styles.cardDesc}>No appointments scheduled today.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scroll: { padding: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F8FAFC' },
  subtitle: { fontSize: 16, color: '#94A3B8', marginTop: 4 },
  card: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  row: { flexDirection: 'row', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#F8FAFC', marginLeft: 8 },
  cardDesc: { fontSize: 14, color: '#94A3B8', marginTop: 4 },
  button: { backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#0ea5e9' },
  buttonText: { color: '#0ea5e9', fontWeight: '600' }
});
