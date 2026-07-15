import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Clock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function DoctorDashboard() {
  const { user, authenticatedFetch } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppts();
  }, []);

  const fetchAppts = async () => {
    try {
      const response = await authenticatedFetch('/api/psychiatrists/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (e) {
      console.log('Error fetching queue:', e);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppts = appointments.filter(a => a.status === 'upcoming');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Dr. {user?.username}</Text>
          <Text style={styles.subtitle}>Today's Clinical Queue</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#8b5cf6" style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryNum}>{appointments.length}</Text>
                <Text style={styles.summaryLabel}>Total Consultations</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryNum}>{upcomingAppts.length}</Text>
                <Text style={styles.summaryLabel}>Up Next</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            {upcomingAppts.length === 0 ? (
               <Text style={{ color: '#94A3B8', textAlign: 'center', marginTop: 20 }}>No appointments in queue.</Text>
            ) : (
              upcomingAppts.map(item => (
                <View key={item.id} style={styles.queueCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={styles.patientName}>Patient {item.user_id.substring(0, 4)}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Clock size={14} color="#94A3B8" />
                        <Text style={styles.timeText}>{item.date} • {item.time_slot}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(234, 179, 8, 0.2)' }]}>
                      <Text style={[styles.statusText, { color: '#eab308' }]}>{item.session_type}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.startBtn}>
                    <Text style={styles.startText}>Start Consultation</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}
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
  summaryRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  summaryCard: { flex: 1, backgroundColor: '#1E293B', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  summaryNum: { fontSize: 24, fontWeight: 'bold', color: '#8b5cf6' },
  summaryLabel: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 16 },
  queueCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  patientName: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  timeText: { marginLeft: 4, color: '#94A3B8', fontSize: 14 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  startBtn: { backgroundColor: '#8b5cf6', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  startText: { color: '#fff', fontWeight: '600' }
});
