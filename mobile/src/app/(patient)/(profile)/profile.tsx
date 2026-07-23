import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User, LogOut, CreditCard, Link2, Watch } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{user?.username?.substring(0,2).toUpperCase() || 'P'}</Text></View>
          <View>
            <Text style={styles.name}>{user?.username}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallet & Payments</Text>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <CreditCard size={20} color="#10b981" />
              <View>
                <Text style={{ color: '#94A3B8' }}>Current Balance</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#10b981' }}>₹500.00</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Integrations</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Link2 size={20} color="#0ea5e9" />
                <Text style={styles.rowText}>ABHA ID Linked</Text>
              </View>
            </View>
            <View style={[styles.row, { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 16, marginTop: 16 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Watch size={20} color="#8b5cf6" />
                <Text style={styles.rowText}>Apple Health Sync</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC' },
  scroll: { padding: 20 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 32 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  avatarText: { fontSize: 24, color: '#F8FAFC', fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#F8FAFC' },
  email: { color: '#94A3B8', marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#F8FAFC', marginBottom: 12 },
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowText: { color: '#F8FAFC', fontSize: 16 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 12, marginTop: 16 },
  logoutText: { color: '#ef4444', fontWeight: '600', fontSize: 16 }
});
