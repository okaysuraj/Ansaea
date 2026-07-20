import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Moon, CheckCircle, Info, Lightbulb, Clock, Sun } from 'lucide-react-native';
import { useAuth } from '../../../context/AuthContext';

export default function SleepTracker() {
  const { authenticatedFetch } = useAuth();
  const [sleepData, setSleepData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const res = await authenticatedFetch('/api/patients/wearable-data');
        if (res.ok) {
          const data = await res.json();
          setSleepData(data.filter((d: any) => d.data_type === 'sleep'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSleepData();
  }, [authenticatedFetch]);

  // Mock cycles data for the bar chart
  const sleepCycles = Array.from({ length: 24 }).map((_, i) => {
    const h = Math.random() * 80 + 20; // 20% to 100%
    const type = h > 75 ? 'deep' : h > 40 ? 'light' : 'awake';
    return { h, type };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep Wellness</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Header Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.subtitle}>Your restorative rest journey. Last night you achieved 86% of your sleep goal.</Text>
        </View>

        {/* Hero Sleep Summary */}
        <View style={styles.heroCard}>
          <View style={styles.heroBgIcon}>
            <Moon size={120} color="rgba(255,255,255,0.05)" />
          </View>
          <Text style={styles.heroLabel}>LAST NIGHT'S QUALITY</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 24 }}>
            <Text style={styles.heroValue}>7h 42m</Text>
            <Text style={styles.heroUnit}>Duration</Text>
          </View>
          
          <View style={styles.heroStatsGrid}>
            <View>
              <Text style={styles.statLabel}>Efficiency</Text>
              <Text style={styles.statValue}>94%</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Deep Sleep</Text>
              <Text style={styles.statValue}>1h 52m</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>REM</Text>
              <Text style={styles.statValue}>2h 10m</Text>
            </View>
          </View>
        </View>

        {/* Log Sleep Card */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View style={styles.iconBox}>
              <Clock size={20} color="#0ea5e9" />
            </View>
            <Text style={styles.cardTitle}>Log Sleep</Text>
          </View>
          
          <View style={{ gap: 12, marginBottom: 24 }}>
            <View>
              <Text style={styles.inputLabel}>Bedtime</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>11:15 PM</Text>
                <Moon size={20} color="#94A3B8" />
              </View>
            </View>
            <View>
              <Text style={styles.inputLabel}>Wake Time</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>06:57 AM</Text>
                <Sun size={20} color="#94A3B8" />
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.btnPrimary}>
            <CheckCircle size={20} color="#FFF" />
            <Text style={styles.btnPrimaryText}>Save Entry</Text>
          </TouchableOpacity>
        </View>

        {/* Cycle Chart Card */}
        <View style={styles.card}>
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.cardTitle}>Sleep Stages</Text>
            <Text style={styles.cardSubtitle}>Cycle analysis for Friday, Oct 24</Text>
          </View>
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#0ea5e9' }]} />
              <Text style={styles.legendText}>Deep</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#6366f1' }]} />
              <Text style={styles.legendText}>Light</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#334155' }]} />
              <Text style={styles.legendText}>Awake</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            {sleepCycles.map((bar, i) => (
              <View 
                key={i} 
                style={[
                  styles.bar, 
                  { 
                    height: `${bar.h}%`, 
                    backgroundColor: bar.type === 'deep' ? '#0ea5e9' : bar.type === 'light' ? '#6366f1' : '#334155'
                  }
                ]} 
              />
            ))}
          </View>
          
          <View style={styles.xAxis}>
            <Text style={styles.xLabel}>11 PM</Text>
            <Text style={styles.xLabel}>1 AM</Text>
            <Text style={styles.xLabel}>3 AM</Text>
            <Text style={styles.xLabel}>5 AM</Text>
            <Text style={styles.xLabel}>7 AM</Text>
          </View>
        </View>

        {/* Wellness Insight Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightIconBox}>
            <Lightbulb size={32} color="#f59e0b" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.insightTitle}>Daily Insight</Text>
            <Text style={styles.insightText}>Based on your REM cycles, you are most productive between 10:00 AM and 1:00 PM today. Try to schedule deep work during this window.</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  scroll: { padding: 16, paddingBottom: 100 },
  
  sectionHeader: { marginBottom: 24 },
  subtitle: { fontSize: 16, color: '#94A3B8', lineHeight: 24 },
  
  heroCard: { backgroundColor: '#1E293B', padding: 24, borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  heroBgIcon: { position: 'absolute', bottom: -20, right: -20 },
  heroLabel: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 1, marginBottom: 8 },
  heroValue: { fontSize: 48, fontWeight: 'bold', color: '#F8FAFC' },
  heroUnit: { fontSize: 16, color: '#94A3B8' },
  heroStatsGrid: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16 },
  statLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },

  card: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginBottom: 16 },
  iconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(14, 165, 233, 0.1)', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  cardSubtitle: { fontSize: 14, color: '#94A3B8', marginTop: 4 },

  inputLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  inputContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#0F172A', borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  inputText: { color: '#F8FAFC', fontSize: 16 },

  btnPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#0ea5e9', padding: 16, borderRadius: 12 },
  btnPrimaryText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  legendContainer: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12, color: '#94A3B8' },

  chartContainer: { height: 150, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2 },
  bar: { flex: 1, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  
  xAxis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  xLabel: { fontSize: 10, color: '#94A3B8' },

  insightCard: { backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 20, borderRadius: 16, flexDirection: 'row', gap: 16, alignItems: 'center' },
  insightIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  insightTitle: { fontSize: 18, fontWeight: 'bold', color: '#f59e0b', marginBottom: 4 },
  insightText: { fontSize: 14, color: '#F8FAFC', lineHeight: 20 }
});
