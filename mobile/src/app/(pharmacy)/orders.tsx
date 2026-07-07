import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, ShoppingCart, Truck } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PharmacyOrders() {
  const [orders, setOrders] = useState([
    { id: 'ORD-1029', patient: 'John Doe', items: 'Lisinopril 10mg, Aspirin 81mg', status: 'pending' },
    { id: 'ORD-1030', patient: 'Jane Smith', items: 'Amoxicillin 500mg', status: 'processing' }
  ]);

  const handleProcess = (id: string) => setOrders(orders.map(o => o.id === id ? { ...o, status: 'processing' } : o));
  const handleShip = (id: string) => setOrders(orders.map(o => o.id === id ? { ...o, status: 'shipped' } : o));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Orders</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {orders.map(order => (
          <View key={order.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <ShoppingCart size={24} color="#0EA5E9" />
              <View>
                <Text style={styles.cardTitle}>{order.id}</Text>
                <Text style={styles.cardSub}>{order.patient}</Text>
              </View>
            </View>
            <Text style={styles.items}>{order.items}</Text>
            
            <View style={styles.actions}>
              <View style={[styles.badge, { backgroundColor: order.status === 'pending' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)' }]}>
                <Text style={[styles.badgeText, { color: order.status === 'pending' ? '#EF4444' : '#F59E0B' }]}>{order.status.toUpperCase()}</Text>
              </View>
              {order.status === 'pending' && (
                <TouchableOpacity style={styles.btnProcess} onPress={() => handleProcess(order.id)}>
                  <Text style={styles.btnText}>Process</Text>
                </TouchableOpacity>
              )}
              {order.status === 'processing' && (
                <TouchableOpacity style={styles.btnShip} onPress={() => handleShip(order.id)}>
                  <Truck size={16} color="#fff" />
                  <Text style={styles.btnText}>Ship</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
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
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155', marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC' },
  cardSub: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  items: { color: '#CBD5E1', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  btnProcess: { backgroundColor: '#334155', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  btnShip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: '600' }
});
