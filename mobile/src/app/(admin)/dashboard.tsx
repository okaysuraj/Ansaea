import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ShieldAlert, Users, Activity } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin & Ops</Text>
          <Text style={styles.username}>{user?.username}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <LogOut size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Users size={24} color="#0EA5E9" />
            <Text style={styles.cardTitle}>Doctor Approvals</Text>
          </View>
          <Text style={styles.cardDesc}>Review and verify 2 pending doctor registrations.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/(admin)/approvals')}>
            <Text style={styles.btnText}>View Queue</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Activity size={24} color="#10B981" />
            <Text style={styles.cardTitle}>System Health</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>API Uptime</Text>
            <Text style={styles.metricValue}>99.99%</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Active Users</Text>
            <Text style={styles.metricValue}>1,245</Text>
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
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 14,
  },
  metricValue: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
