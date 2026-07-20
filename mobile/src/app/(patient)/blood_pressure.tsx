import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus, ChevronRight, Activity, Lightbulb } from 'lucide-react-native';
import { useAuth } from '../../../context/AuthContext';

export default function BloodPressureHistory() {
  const { authenticatedFetch } = useAuth();
  const [view, setView] = useState<'list' | 'chart'>('list');
  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const res = await authenticatedFetch('/api/patients/vitals');
        if (res.ok) {
          const data = await res.json();
          setVitals(data.filter((v: any) => v.blood_pressure));
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
    { id: 1, date: 'Oct 24 • 08:30 AM', sys: 142, dia: 91, status: 'High' },
    { id: 2, date: 'Oct 23 • 07:15 PM', sys: 128, dia: 84, status: 'Elevated' },
    { id: 3, date: 'Oct 22 • 09:00 AM', sys: 118, dia: 78, status: 'Normal' },
    { id: 4, date: 'Oct 21 • 08:45 PM', sys: 115, dia: 76, status: 'Normal' },
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Normal': return { bg: 'rgba(22, 163, 74, 0.1)', text: '#16a34a', border: '#16a34a' };
      case 'Elevated': return { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308', border: '#eab308' };
      default: return { bg: 'rgba(220, 38, 38, 0.1)', text: '#dc2626', border: '#dc2626' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blood Pressure</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Toggle View */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, view === 'list' && styles.toggleBtnActive]}
            onPress={() => setView('list')}
          >
            <Text style={[styles.toggleText, view === 'list' && styles.toggleTextActive]}>List</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, view === 'chart' && styles.toggleBtnActive]}
            onPress={() => setView('chart')}
          >
            <Text style={[styles.toggleText, view === 'chart' && styles.toggleTextActive]}>Chart</Text>
          </TouchableOpacity>
        </View>

        {view === 'list' ? (
          <View style={styles.listContainer}>
            {mockReadings.map(reading => {
              const colors = getStatusStyle(reading.status);
              return (
                <View key={reading.id} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: colors.border }]}>
                  <View>
                    <View style={styles.readingRow}>
                      <Text style={styles.readingValue}>{reading.sys}/{reading.dia}</Text>
                      <Text style={styles.unitText}>mmHg</Text>
                    </View>
                    <Text style={styles.dateText}>{reading.date}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 8 }}>
                    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                      <Text style={[styles.badgeText, { color: colors.text }]}>{reading.status}</Text>
                    </View>
                    <ChevronRight size={20} color="#64748b" />
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.chartContainer}>
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>7-Day Trend</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#0ea5e9' }} />
                    <Text style={styles.legendText}>Sys</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#10b981' }} />
                    <Text style={styles.legendText}>Dia</Text>
                  </View>
                </View>
              </View>

              {/* Chart Placeholder */}
              <View style={styles.chartPlaceholder}>
                <Activity size={48} color="#334155" />
                <Text style={{ color: '#64748b', marginTop: 12 }}>Chart Visualization</Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <Lightbulb size={32} color="#fff" />
              <View style={{ flex: 1 }}>
                <Text style={styles.insightTitle}>Clinical Insight</Text>
                <Text style={styles.insightDesc}>
                  Your morning readings are 12% higher than evening readings over the last 3 days. Consider monitoring sodium intake at dinner.
                </Text>
              </View>
            </View>
          </View>
        )}
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
  
  toggleContainer: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 4, borderRadius: 12, marginBottom: 24, alignSelf: 'flex-end' },
  toggleBtn: { paddingVertical: 8, paddingHorizontal: 24, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: '#0ea5e9' },
  toggleText: { color: '#94A3B8', fontWeight: 'bold' },
  toggleTextActive: { color: '#fff' },

  listContainer: { gap: 16 },
  card: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  readingRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 4 },
  readingValue: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC' },
  unitText: { fontSize: 14, color: '#94A3B8' },
  dateText: { fontSize: 13, color: '#94A3B8' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },

  chartContainer: { gap: 16 },
  chartCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC' },
  legendText: { fontSize: 12, color: '#94A3B8' },
  chartPlaceholder: { height: 200, backgroundColor: '#0F172A', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  
  insightCard: { backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: 20, borderRadius: 16, flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  insightTitle: { fontSize: 16, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 4 },
  insightDesc: { fontSize: 14, color: '#94A3B8', lineHeight: 20 },

  fab: { position: 'absolute', bottom: 24, right: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }
});
