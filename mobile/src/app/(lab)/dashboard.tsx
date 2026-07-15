import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { FlaskConical, LogOut } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function LabDashboard() {
  const { logout, authenticatedFetch } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await authenticatedFetch('/api/lab/requests');
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [authenticatedFetch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FlaskConical size={24} color="#0ea5e9" />
          <Text style={styles.title}>Lab Services</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Pending Requests</Text>
        {loading ? <ActivityIndicator color="#0ea5e9" /> : 
          requests.length === 0 ? <Text style={styles.emptyText}>No pending lab requests.</Text> :
          requests.map((r: any) => (
            <View key={r.id} style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.cardTitle}>{r.id.substring(0, 8)}</Text>
                <Text style={{ color: r.status === 'pending' ? '#ef4444' : '#0ea5e9', fontWeight: 'bold' }}>{r.status.toUpperCase()}</Text>
              </View>
              <Text style={styles.cardText}>Tests: {r.test_names.join(', ')}</Text>
              <Text style={styles.cardText}>Date: {new Date(r.created_at).toLocaleDateString()}</Text>
            </View>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
  container: { flex: 1, backgroundColor: '#0F172A' }, 
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1E293B' }, 
  title: { fontSize: 22, fontWeight: 'bold', color: '#F8FAFC' }, 
  content: { padding: 20 }, 
  sectionTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  emptyText: { color: '#94A3B8', fontSize: 16, marginBottom: 32 }, 
  logoutBtn: { padding: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 8 }, 
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardText: { color: '#94A3B8', fontSize: 14 }
});
