import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus, ChevronRight, TrendingDown, Activity, Calendar as CalendarIcon, Target } from 'lucide-react-native';
import { useAuth } from '../../../context/AuthContext';

export default function WeightBmiTracker() {
  const { authenticatedFetch } = useAuth();
  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const res = await authenticatedFetch('/api/patients/vitals');
        if (res.ok) {
          const data = await res.json();
          setVitals(data.filter((v: any) => v.bmi));
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
    { id: 1, date: 'Oct 24, 2023', time: '08:15 AM', weight: 74.5 },
    { id: 2, date: 'Oct 21, 2023', time: '07:50 AM', weight: 75.1 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weight & BMI</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Current Weight Section */}
        <View style={styles.heroSection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <View>
              <Text style={styles.heroLabel}>Current Weight</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                <Text style={styles.heroValue}>74.5</Text>
                <Text style={styles.heroUnit}>kg</Text>
              </View>
            </View>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>-1.2 kg this week</Text>
            </View>
          </View>

          {/* Goal Card */}
          <View style={styles.goalCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={styles.goalText}>Goal: 70.0 kg</Text>
              <Text style={styles.goalProgressText}>60% Reached</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '60%' }]} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <Text style={styles.goalSubtext}>Start: 82.0 kg</Text>
              <Text style={styles.goalSubtext}>Remaining: 4.5 kg</Text>
            </View>
          </View>
        </View>

        {/* BMI Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BMI Analysis</Text>
          <View style={styles.bmiCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={styles.bmiLabel}>Your BMI is</Text>
                <Text style={styles.bmiValue}>24.2</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={styles.bmiBadge}>
                  <Text style={styles.bmiBadgeText}>Healthy Weight</Text>
                </View>
                <Text style={styles.bmiSubtext}>Optimal range: 18.5 - 24.9</Text>
              </View>
            </View>
            
            {/* BMI Scale */}
            <View style={styles.bmiScaleContainer}>
              <View style={styles.bmiScale} />
              {/* Indicator */}
              <View style={[styles.bmiIndicator, { left: '45%' }]} />
              <View style={styles.bmiScaleLabels}>
                <Text style={styles.bmiScaleLabelText}>Under</Text>
                <Text style={styles.bmiScaleLabelText}>Normal</Text>
                <Text style={styles.bmiScaleLabelText}>Over</Text>
                <Text style={styles.bmiScaleLabelText}>Obese</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Insights Grid */}
        <View style={styles.insightsGrid}>
          <View style={[styles.insightCard, { backgroundColor: 'rgba(14, 165, 233, 0.1)' }]}>
            <TrendingDown size={24} color="#0ea5e9" style={{ marginBottom: 8 }} />
            <Text style={styles.insightLabel}>Last Month</Text>
            <Text style={[styles.insightValue, { color: '#0ea5e9' }]}>-3.5 kg</Text>
          </View>
          <View style={[styles.insightCard, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
            <Activity size={24} color="#6366f1" style={{ marginBottom: 8 }} />
            <Text style={styles.insightLabel}>Body Fat</Text>
            <Text style={[styles.insightValue, { color: '#6366f1' }]}>21.8%</Text>
          </View>
          <View style={[styles.insightCardFull, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <View>
              <Text style={styles.insightLabel}>Next Weight-in</Text>
              <Text style={[styles.insightValue, { color: '#10b981' }]}>Tomorrow morning</Text>
            </View>
            <CalendarIcon size={32} color="#10b981" />
          </View>
        </View>

        {/* Recent Logs */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>Recent Logs</Text>
            <Text style={styles.viewAllText}>View All</Text>
          </View>
          
          {mockReadings.map((reading) => (
            <View key={reading.id} style={styles.logCard}>
              <View style={styles.logLeft}>
                <View style={styles.logIcon}>
                  <Target size={20} color="#94A3B8" />
                </View>
                <View>
                  <Text style={styles.logDate}>{reading.date}</Text>
                  <Text style={styles.logTime}>{reading.time}</Text>
                </View>
              </View>
              <Text style={styles.logWeight}>{reading.weight} kg</Text>
            </View>
          ))}
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
  
  heroSection: { marginBottom: 24 },
  heroLabel: { fontSize: 14, color: '#94A3B8', marginBottom: 4 },
  heroValue: { fontSize: 40, fontWeight: 'bold', color: '#0ea5e9' },
  heroUnit: { fontSize: 18, color: '#94A3B8' },
  badgeContainer: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  badgeText: { color: '#10b981', fontSize: 12, fontWeight: 'bold' },

  goalCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginTop: 16 },
  goalText: { color: '#F8FAFC', fontSize: 14, fontWeight: '500' },
  goalProgressText: { color: '#0ea5e9', fontSize: 14, fontWeight: 'bold' },
  progressBarBg: { height: 10, backgroundColor: '#334155', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#0ea5e9', borderRadius: 5 },
  goalSubtext: { color: '#94A3B8', fontSize: 12 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 12 },
  
  bmiCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16 },
  bmiLabel: { color: '#94A3B8', fontSize: 14, marginBottom: 4 },
  bmiValue: { fontSize: 32, fontWeight: 'bold', color: '#F8FAFC' },
  bmiBadge: { backgroundColor: '#0ea5e9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 8 },
  bmiBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  bmiSubtext: { color: '#94A3B8', fontSize: 12 },

  bmiScaleContainer: { marginTop: 20 },
  bmiScale: { height: 8, borderRadius: 4, backgroundColor: '#334155' }, // In a real app, use linear gradient
  bmiIndicator: { position: 'absolute', top: -6, width: 12, height: 12, backgroundColor: '#F8FAFC', borderRadius: 6, transform: [{ translateX: -6 }] },
  bmiScaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  bmiScaleLabelText: { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase' },

  insightsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  insightCard: { flex: 1, padding: 16, borderRadius: 16, minWidth: '45%' },
  insightCardFull: { width: '100%', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  insightLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  insightValue: { fontSize: 20, fontWeight: 'bold' },

  viewAllText: { color: '#0ea5e9', fontSize: 14, fontWeight: '500' },
  logCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  logLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center' },
  logDate: { color: '#F8FAFC', fontSize: 14, fontWeight: '500' },
  logTime: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  logWeight: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' },

  fab: { position: 'absolute', bottom: 24, right: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }
});
