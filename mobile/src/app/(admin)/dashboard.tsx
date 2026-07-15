import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Shield, LogOut, CheckCircle, XCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { logout, authenticatedFetch } = useAuth();
  const [stats, setStats] = useState({ uptime: "99.99%", active_users: 0 });
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statRes, appRes] = await Promise.all([
          authenticatedFetch('/api/admin/system-health'),
          authenticatedFetch('/api/admin/approvals')
        ]);
        if (statRes.ok) setStats(await statRes.json());
        if (appRes.ok) setApprovals(await appRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authenticatedFetch]);

  const handleStatus = async (id: string, newStatus: string) => {
    setApprovals(approvals.map((a: any) => a.id === id ? { ...a, status: newStatus } : a));
    try {
      await authenticatedFetch(`/api/admin/approvals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Shield size={24} color="#ef4444" />
          <Text style={styles.title}>System Admin</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        
        {loading ? <ActivityIndicator color="#ef4444" style={{ marginTop: 20 }} /> : (
          <>
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>System Health</Text>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>API Uptime:</Text>
                <Text style={styles.statValueGreen}>{stats.uptime}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Active Users:</Text>
                <Text style={styles.statValue}>{stats.active_users}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Doctor Approvals Queue</Text>
            {approvals.length === 0 ? <Text style={styles.emptyText}>No pending approvals.</Text> :
              approvals.map((doc: any) => (
                <View key={doc.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{doc.name}</Text>
                  <Text style={styles.cardText}>Specialty: {doc.specialty}</Text>
                  <Text style={styles.cardText}>License: {doc.license}</Text>
                  
                  {doc.status === 'pending' ? (
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={styles.approveBtn} onPress={() => handleStatus(doc.id, 'approved')}>
                        <CheckCircle size={16} color="#fff" />
                        <Text style={styles.btnText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => handleStatus(doc.id, 'rejected')}>
                        <XCircle size={16} color="#ef4444" />
                        <Text style={[styles.btnText, { color: '#ef4444' }]}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={{ marginTop: 12, color: doc.status === 'approved' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                      {doc.status.toUpperCase()}
                    </Text>
                  )}
                </View>
              ))
            }
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
  container: { flex: 1, backgroundColor: '#0F172A' }, 
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1E293B' }, 
  title: { fontSize: 22, fontWeight: 'bold', color: '#F8FAFC' }, 
  content: { padding: 20 }, 
  statsCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  statsTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statLabel: { color: '#94A3B8', fontSize: 16 },
  statValue: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },
  statValueGreen: { color: '#10b981', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  emptyText: { color: '#94A3B8', fontSize: 16, marginBottom: 32 }, 
  logoutBtn: { padding: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 8 }, 
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardText: { color: '#94A3B8', fontSize: 14, marginBottom: 4 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  approveBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10b981', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  rejectBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 14 }
});
