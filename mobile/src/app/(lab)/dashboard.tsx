import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { LogOut, FlaskConical, ClipboardList, Upload } from 'lucide-react-native';
import { router } from 'expo-router';

export default function LabDashboard() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Lab Portal</Text>
          <Text style={styles.username}>{user?.username}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <LogOut size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ClipboardList size={24} color="#0EA5E9" />
            <Text style={styles.cardTitle}>Test Requests</Text>
          </View>
          <Text style={styles.cardDesc}>You have 2 pending home sample collections.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/(lab)/tests')}>
            <Text style={styles.btnText}>View Requests</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Upload size={24} color="#10B981" />
            <Text style={styles.cardTitle}>Report Uploads</Text>
          </View>
          <Text style={styles.cardDesc}>Upload results and notify doctors securely.</Text>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#10B981' }]}>
            <Text style={styles.btnText}>Upload Report</Text>
          </TouchableOpacity>
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
  }
});
