import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Pill, ShoppingCart, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PharmacyDashboard() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Pharmacy Portal</Text>
          <Text style={styles.username}>{user?.username}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <LogOut size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ShoppingCart size={24} color="#0EA5E9" />
            <Text style={styles.cardTitle}>Active Orders</Text>
          </View>
          <Text style={styles.cardDesc}>You have 5 new e-prescriptions waiting to be fulfilled.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/(pharmacy)/orders')}>
            <Text style={styles.btnText}>Process Orders</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AlertTriangle size={24} color="#F59E0B" />
            <Text style={styles.cardTitle}>Inventory Alerts</Text>
          </View>
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>Low Stock: Metformin 500mg</Text>
          </View>
          <View style={[styles.alertBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderLeftColor: '#F59E0B' }]}>
            <Text style={[styles.alertText, { color: '#F59E0B' }]}>Expiring Soon: Ibuprofen 400mg</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  greeting: {
    color: '#94A3B8',
    fontSize: 14,
  },
  username: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  cardDesc: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  btn: {
    backgroundColor: '#0EA5E9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  alertBox: {
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
    borderRadius: 4,
    marginBottom: 8,
  },
  alertText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  }
});
