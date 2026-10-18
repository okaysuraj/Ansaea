import { AlertTriangle, CheckCircle2, Layers, LogOut, Package, Pill } from 'lucide-react-native';
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

export default function PharmacyDashboard() {
  const { logout, authenticatedFetch } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await authenticatedFetch('/api/pharmacy/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to load pharmacy orders:', e);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await authenticatedFetch('/api/pharmacy/inventory');
      if (res.ok) {
        const data = await res.json();
        setInventory(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to load pharmacy inventory:', e);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchInventory()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [authenticatedFetch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchOrders(), fetchInventory()]);
    setRefreshing(false);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await authenticatedFetch(
        `/api/pharmacy/orders/${orderId}/status?status=${newStatus}`,
        {
          method: 'PATCH',
        },
      );
      if (res.ok) {
        Alert.alert('Status Updated', `Order marked as ${newStatus}.`);
        fetchOrders();
      } else {
        Alert.alert('Update Failed', 'Could not update order status.');
      }
    } catch (e) {
      Alert.alert('Error', 'Network request failed.');
    }
  };

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const completedCount = orders.filter(
    (o) => o.status === 'completed' || o.status === 'dispensed',
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={styles.headerIcon}>
            <Pill size={22} color="#10B981" />
          </View>
          <View>
            <Text style={styles.title}>Pharmacy Portal</Text>
            <Text style={styles.subtitle}>Medication Dispensing & Stock</Text>
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
          <Text style={styles.kpiLabel}>Pending Queue</Text>
          <Text style={[styles.kpiValue, { color: '#EF4444' }]}>{pendingCount}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Fulfilled</Text>
          <Text style={[styles.kpiValue, { color: '#10B981' }]}>{completedCount}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Catalog Items</Text>
          <Text style={[styles.kpiValue, { color: '#38BDF8' }]}>{inventory.length || 24}</Text>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'orders' && styles.tabBtnActive]}
          onPress={() => setActiveTab('orders')}
        >
          <Package
            size={16}
            color={activeTab === 'orders' ? '#FFFFFF' : '#94A3B8'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>
            Prescription Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'inventory' && styles.tabBtnActive]}
          onPress={() => setActiveTab('inventory')}
        >
          <Layers
            size={16}
            color={activeTab === 'inventory' ? '#FFFFFF' : '#94A3B8'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, activeTab === 'inventory' && styles.tabTextActive]}>
            Stock Inventory
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
        ) : activeTab === 'orders' ? (
          /* Orders Queue */
          orders.length === 0 ? (
            <View style={styles.emptyBox}>
              <Package size={44} color="#64748B" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>No Orders Pending</Text>
              <Text style={styles.emptySubtitle}>
                All incoming patient prescriptions have been processed.
              </Text>
            </View>
          ) : (
            orders.map((o: any) => {
              const isPending = o.status === 'pending';
              return (
                <View key={o.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardId}>
                      Order #{String(o.id).substring(0, 8).toUpperCase()}
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
                        {o.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardMeta}>
                    Amount:{' '}
                    <Text style={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                      ₹{o.total_amount || 450}
                    </Text>
                  </Text>
                  <Text style={styles.cardMeta}>
                    Date: {o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Today'}
                  </Text>

                  {isPending && (
                    <TouchableOpacity
                      style={styles.dispenseBtn}
                      onPress={() => handleUpdateStatus(o.id, 'completed')}
                    >
                      <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.dispenseBtnText}>Dispense & Fulfill</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )
        ) : /* Inventory Items */
        inventory.length === 0 ? (
          <View style={styles.emptyBox}>
            <AlertTriangle size={44} color="#F59E0B" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>Inventory Empty</Text>
            <Text style={styles.emptySubtitle}>
              No pharmacy stock items configured in database.
            </Text>
          </View>
        ) : (
          inventory.map((item: any) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardId}>{item.name}</Text>
                <Text
                  style={{
                    color: item.stock_quantity > 10 ? '#10B981' : '#EF4444',
                    fontWeight: 'bold',
                  }}
                >
                  {item.stock_quantity} in stock
                </Text>
              </View>
              <Text style={styles.cardMeta}>Dosage: {item.dosage || 'Standard'}</Text>
              <Text style={styles.cardMeta}>Category: {item.category || 'Prescription'}</Text>
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
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
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
    backgroundColor: '#10B981',
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
  dispenseBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  dispenseBtnText: {
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
