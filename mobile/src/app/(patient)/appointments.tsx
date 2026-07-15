import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Calendar, MessageSquare, Video, Phone } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function MyAppointments() {
  const { authenticatedFetch } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await authenticatedFetch('/api/psychiatrists/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (e) {
      console.log('Error fetching appointments:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      { text: "No", style: "cancel" },
      { 
        text: "Yes, Cancel", 
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await authenticatedFetch(`/api/psychiatrists/appointments/${id}/cancel`, { method: 'POST' });
            if (response.ok) fetchAppointments();
          } catch (e) {
            console.log(e);
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Sessions</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0ea5e9" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {appointments.length === 0 ? (
            <Text style={{ color: '#94A3B8', textAlign: 'center', marginTop: 40 }}>No upcoming sessions.</Text>
          ) : (
            appointments.map(appt => (
              <View key={appt.id} style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.docName}>{appt.doctor_name}</Text>
                    <Text style={{ color: '#0ea5e9', fontSize: 12, marginTop: 2 }}>{appt.doctor_specialty}</Text>
                    <Text style={styles.date}>{appt.date} • {appt.time_slot}</Text>
                  </View>
                  <View style={styles.iconBox}>
                    {appt.session_type === 'video' ? <Video size={20} color="#0ea5e9" /> : 
                     appt.session_type === 'call' ? <Phone size={20} color="#0ea5e9" /> :
                     <MessageSquare size={20} color="#0ea5e9" />}
                  </View>
                </View>
                
                {appt.status === 'upcoming' ? (
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.joinBtn}><Text style={styles.joinText}>Join Session</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(appt.id)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ marginTop: 16, alignItems: 'center' }}>
                    <Text style={{ color: appt.status === 'cancelled' ? '#ef4444' : '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {appt.status}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC' },
  scroll: { padding: 20 },
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  docName: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  date: { fontSize: 14, color: '#94A3B8', marginTop: 8 },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(14, 165, 233, 0.1)', alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', marginTop: 16, gap: 12 },
  joinBtn: { flex: 1, backgroundColor: '#0ea5e9', padding: 12, borderRadius: 8, alignItems: 'center' },
  joinText: { color: '#fff', fontWeight: '600' },
  cancelBtn: { flex: 1, backgroundColor: 'transparent', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ef4444' },
  cancelText: { color: '#ef4444', fontWeight: '600' }
});
