import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus, ChevronRight, Droplet, TrendingDown, TrendingUp, Calendar as CalendarIcon, Restaurant, Coffee, Sun } from 'lucide-react-native';
import { useAuth } from '../../../context/AuthContext';

export default function BloodSugarHistory() {
  const { authenticatedFetch } = useAuth();
  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const res = await authenticatedFetch('/api/patients/vitals');
        if (res.ok) {
          const data = await res.json();
          setVitals(data.filter((v: any) => v.blood_sugar));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVitals();
  }, [authenticatedFetch]);

  const mockReadings = [
    { id: 1, date: 'Today, Oct 24', time: '08:30 PM', type: 'After Meal', value: 112, icon: 'Restaurant', status: 'Optimal' },
    { id: 2, date: 'Today, Oct 24', time: '07:15 AM', type: 'Before Meal', value: 96, icon: 'Coffee', status: 'Optimal' },
    { id: 3, date: 'Yesterday, Oct 23', time: '09:00 PM', type: 'After Meal', value: 154, icon: 'Restaurant', status: 'High' },
    { id: 4, date: 'Yesterday, Oct 23', time: '06:45 AM', type: 'Fasting', value: 94, icon: 'Sun', status: 'Optimal' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'High': return { bg: 'rgba(220, 38, 38, 0.1)', text: '#dc2626' };
      default: return { bg: 'rgba(22, 163, 74, 0.1)', text: '#16a34a' };
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Restaurant': return <Droplet size={24} color="#0ea5e9" />;
      case 'Coffee': return <Droplet size={24} color="#6366f1" />;
      case 'Sun': return <Droplet size={24} color="#f59e0b" />;
      default: return <Droplet size={24} color="#10b981" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blood Sugar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Dashboard Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>7-DAY AVERAGE</Text>
          <View style={styles.summaryValueRow}>
            <Text style={styles.summaryValue}>108</Text>
            <Text style={styles.summaryUnit}>mg/dL</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '74%' }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabelText}>In Range (74%)</Text>
              <Text style={styles.progressLabelStatus}>Healthy</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: 'rgba(14, 165, 233, 0.1)' }]}>
            <TrendingDown size={24} color="#0ea5e9" style={{ marginBottom: 8 }} />
            <Text style={styles.statLabel}>Lowest</Text>
            <Text style={[styles.statValue, { color: '#0ea5e9' }]}>92 mg/dL</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <TrendingUp size={24} color="#ef4444" style={{ marginBottom: 8 }} />
            <Text style={styles.statLabel}>Highest</Text>
            <Text style={[styles.statValue, { color: '#ef4444' }]}>154 mg/dL</Text>
          </View>
        </View>

        {/* Activity Log */}
        <View style={styles.logHeader}>
          <Text style={styles.logTitle}>Activity Log</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <CalendarIcon size={16} color="#0ea5e9" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logContainer}>
          {mockReadings.map((reading, index) => {
            const showDateHeader = index === 0 || mockReadings[index - 1].date !== reading.date;
            
            return (
              <View key={reading.id}>
                {showDateHeader && (
                  <Text style={styles.dateHeader}>{reading.date}</Text>
                )}
                
                <TouchableOpacity style={styles.readingCard}>
                  <View style={styles.readingLeft}>
                    <View style={styles.iconWrapper}>
                      {getIcon(reading.icon)}
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                        <Text style={[styles.readingVal, reading.status === 'High' && { color: '#ef4444' }]}>{reading.value}</Text>
                        <Text style={styles.readingUnit}>mg/dL</Text>
                      </View>
                      <View style={styles.readingMeta}>
                        <View style={styles.typeBadge}>
                          <Text style={styles.typeText}>{reading.type}</Text>
                        </View>
                        <Text style={styles.timeText}>{reading.time}</Text>
                      </View>
                    </View>
                  </View>
                  <ChevronRight size={24} color="#334155" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Plus size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  scroll: { padding: 16, paddingBottom: 100 },
  
  summaryCard: { backgroundColor: '#1E293B', padding: 24, borderRadius: 16, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  summaryLabel: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8', marginBottom: 8, letterSpacing: 1 },
  summaryValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 24 },
  summaryValue: { fontSize: 48, fontWeight: 'bold', color: '#0ea5e9' },
  summaryUnit: { fontSize: 16, color: '#94A3B8', fontWeight: '500' },
  
  progressContainer: { gap: 8 },
  progressBarBg: { height: 8, backgroundColor: '#334155', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#10b981', borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabelText: { fontSize: 12, color: '#94A3B8' },
  progressLabelStatus: { fontSize: 12, color: '#10b981', fontWeight: 'bold' },

  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'flex-start' },
  statLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold' },

  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  logTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterText: { color: '#0ea5e9', fontSize: 14, fontWeight: 'bold' },

  logContainer: { gap: 8 },
  dateHeader: { fontSize: 14, color: '#94A3B8', marginTop: 16, marginBottom: 8 },
  
  readingCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  readingLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(14, 165, 233, 0.1)', alignItems: 'center', justifyContent: 'center' },
  readingVal: { fontSize: 22, fontWeight: 'bold', color: '#F8FAFC' },
  readingUnit: { fontSize: 14, color: '#94A3B8' },
  readingMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  typeBadge: { backgroundColor: 'rgba(14, 165, 233, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  typeText: { fontSize: 12, color: '#0ea5e9', fontWeight: '500' },
  timeText: { fontSize: 12, color: '#94A3B8' },

  fab: { position: 'absolute', bottom: 24, right: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }
});
