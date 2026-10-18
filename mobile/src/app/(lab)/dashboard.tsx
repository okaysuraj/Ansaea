import { CheckCircle2, Clock, FileCheck, FlaskConical, Layers, LogOut } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/useAuth';

export default function LabDashboard() {
  const { logout, authenticatedFetch } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'catalog'>('requests');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const defaultCatalog = [
    {
      code: 'CBC-01',
      name: 'Complete Blood Count with Differential',
      tat: '4-6 hours',
      specimen: 'Whole Blood (EDTA)',
    },
    {
      code: 'CMP-02',
      name: 'Comprehensive Metabolic Panel',
      tat: '6-8 hours',
      specimen: 'Serum (SST)',
    },
    {
      code: 'LP-03',
      name: 'Lipid Profile (Total, HDL, LDL, Trig)',
      tat: '4 hours',
      specimen: 'Serum (Fasting)',
    },
    {
      code: 'TSH-04',
      name: 'Thyroid Stimulating Hormone (3rd Gen)',
      tat: '12 hours',
      specimen: 'Serum',
    },
    {
      code: 'HBA1C-05',
      name: 'Glycated Hemoglobin (HbA1c)',
      tat: '4 hours',
      specimen: 'Whole Blood',
    },
  ];

  const fetchRequests = async () => {
    try {
      const res = await authenticatedFetch('/api/lab/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to load lab requests:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [authenticatedFetch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    try {
      const res = await authenticatedFetch(
        `/api/lab/requests/${requestId}/status?status=${newStatus}`,
        {
          method: 'PATCH',
        },
      );
      if (res.ok) {
        Alert.alert('Specimen Updated', `Test request marked as ${newStatus}.`);
        fetchRequests();
      } else {
        Alert.alert('Update Failed', 'Could not update request status.');
      }
    } catch (e) {
      Alert.alert('Error', 'Network request failed.');
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const completedCount = requests.filter((r) => r.status === 'completed').length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={styles.headerIcon}>
            <FlaskConical size={22} color="#0EA5E9" />
          </View>
          <View>
            <Text style={styles.title}>Laboratory Portal</Text>
            <Text style={styles.subtitle}>Diagnostics & Specimen Tracking</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={logout}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <LogOut size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* KPI Metric Strip */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Pending Tests</Text>
          <Text style={[styles.kpiValue, { color: '#EF4444' }]}>{pendingCount}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Completed</Text>
          <Text style={[styles.kpiValue, { color: '#10B981' }]}>{completedCount}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Avg Turnaround</Text>
          <Text style={[styles.kpiValue, { color: '#38BDF8' }]}>4.2h</Text>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'requests' && styles.tabBtnActive]}
          onPress={() => setActiveTab('requests')}
        >
          <Clock
            size={16}
            color={activeTab === 'requests' ? '#FFFFFF' : '#94A3B8'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
            Test Queue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'catalog' && styles.tabBtnActive]}
          onPress={() => setActiveTab('catalog')}
        >
          <Layers
            size={16}
            color={activeTab === 'catalog' ? '#FFFFFF' : '#94A3B8'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, activeTab === 'catalog' && styles.tabTextActive]}>
            Diagnostic Catalog
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0EA5E9" />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0EA5E9" style={{ marginTop: 40 }} />
        ) : activeTab === 'requests' ? (
          /* Request Queue */
          requests.length === 0 ? (
            <View style={styles.emptyBox}>
              <CheckCircle2 size={44} color="#10B981" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>Queue Clear</Text>
              <Text style={styles.emptySubtitle}>
                No pending specimen batches awaiting laboratory analysis.
              </Text>
            </View>
          ) : (
            requests.map((r: any) => {
              const isPending = r.status === 'pending';
              const tests = Array.isArray(r.test_names)
                ? r.test_names.join(', ')
                : 'Standard Diagnostic Panel';

              return (
                <View key={r.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardId}>
                      Sample #{String(r.id).substring(0, 8).toUpperCase()}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: isPending
                            ? 'rgba(239, 68, 68, 0.15)'
                            : 'rgba(16, 185, 129, 0.15)',
                        },
                      ]}
                    >
                      <Text
                        style={[styles.statusText, { color: isPending ? '#EF4444' : '#10B981' }]}
                      >
                        {r.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardMeta}>
                    Tests: <Text style={{ color: '#F8FAFC', fontWeight: '600' }}>{tests}</Text>
                  </Text>
                  <Text style={styles.cardMeta}>
                    Received: {r.created_at ? new Date(r.created_at).toLocaleString() : 'Recent'}
                  </Text>

                  {isPending && (
                    <TouchableOpacity
                      style={styles.completeBtn}
                      onPress={() => handleUpdateStatus(r.id, 'completed')}
                    >
                      <FileCheck size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.completeBtnText}>Finalize & Certify Results</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )
        ) : (
          /* Diagnostic Catalog */
          defaultCatalog.map((item) => (
            <View key={item.code} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardId}>{item.name}</Text>
                <Text style={{ color: '#0EA5E9', fontWeight: 'bold' }}>{item.code}</Text>
              </View>
              <Text style={styles.cardMeta}>Specimen Type: {item.specimen}</Text>
              <Text style={styles.cardMeta}>Expected TAT: {item.tat}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 4,
    marginBottom: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#0EA5E9',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardId: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardMeta: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 4,
  },
  completeBtn: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
  },
});
