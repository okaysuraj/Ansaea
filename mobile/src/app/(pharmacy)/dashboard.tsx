import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Pill, LogOut, Package } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function PharmacyDashboard() {
  const { logout, authenticatedFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await authenticatedFetch('/api/pharmacy/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [authenticatedFetch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pill size={24} color="#10b981" />
          <Text style={styles.title}>E-Pharmacy</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Active Orders</Text>
        {loading ? <ActivityIndicator color="#10b981" /> : 
          orders.length === 0 ? <Text style={styles.emptyText}>No active orders.</Text> :
          orders.map((o: any) => (
            <View key={o.id} style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.cardTitle}>{o.id.substring(0, 8)}</Text>
                <Text style={{ color: o.status === 'pending' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{o.status.toUpperCase()}</Text>
              </View>
              <Text style={styles.cardText}>Total: ${o.total_amount}</Text>
              <Text style={styles.cardText}>Date: {new Date(o.created_at).toLocaleDateString()}</Text>
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
