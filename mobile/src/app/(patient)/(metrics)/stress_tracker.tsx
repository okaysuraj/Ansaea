import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Brain, Moon, Dumbbell, Wind, HeartPulse } from 'lucide-react-native';
import { useAuth } from '../../../context/AuthContext';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function StressTracker() {
  const { authenticatedFetch } = useAuth();
  const [stressData, setStressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStressData = async () => {
      try {
        const res = await authenticatedFetch('/api/patients/wearable-data');
        if (res.ok) {
          const data = await res.json();
          setStressData(data.filter((d: any) => d.data_type === 'stress'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStressData();
  }, [authenticatedFetch]);

  // SVG Progress Ring logic
  const radius = 60;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const score = 72;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Mock peaks for bar chart
  const stressPeaks = [
    { time: '08:00', val: 40 },
    { time: '10:00', val: 65 },
    { time: '12:00', val: 90, peak: true },
    { time: '14:00', val: 45 },
    { time: '16:00', val: 25 },
    { time: '18:00', val: 55 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stress Tracker</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Header Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Your Stress Resilience</Text>
          <Text style={styles.subtitle}>Today you're showing high adaptability. Your levels are lower than 78% of your average Tuesday.</Text>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreTop}>
            <View style={styles.progressContainer}>
              <Svg height="160" width="160" viewBox="0 0 160 160">
                <Circle cx="80" cy="80" r={radius} stroke="#334155" strokeWidth={strokeWidth} fill="transparent" />
                <Circle 
                  cx="80" cy="80" r={radius} 
                  stroke="#10b981" 
                  strokeWidth={strokeWidth} 
                  fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round" 
                  transform="rotate(-90 80 80)"
                />
              </Svg>
              <View style={styles.progressTextContainer}>
                <Text style={styles.scoreValue}>{score}</Text>
                <Text style={styles.scoreLabel}>Score</Text>
              </View>
            </View>
            
            <View style={styles.scoreInfo}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Status: Optimal</Text>
              </View>
              <Text style={styles.scoreDesc}>Your heart rate variability (HRV) is trending upward, indicating strong parasympathetic activation.</Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.btnPrimary}>
              <Brain size={18} color="#FFF" />
              <Text style={styles.btnPrimaryText}>Log Mindset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary}>
              <Text style={styles.btnSecondaryText}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* De-stress Now */}
        <TouchableOpacity style={styles.deStressCard}>
          <Wind size={40} color="#0ea5e9" opacity={0.8} />
          <View style={{ flex: 1 }}>
            <Text style={styles.deStressTitle}>De-stress Now</Text>
            <Text style={styles.deStressDesc}>A 3-minute Box Breathing session is recommended.</Text>
          </View>
        </TouchableOpacity>

        {/* Daily Stress Peaks */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Stress Peaks</Text>
          
          <View style={styles.chartContainer}>
            {stressPeaks.map((bar, i) => (
              <View key={i} style={styles.barCol}>
                <View style={[styles.bar, { height: `${bar.val}%`, backgroundColor: bar.peak ? '#0ea5e9' : 'rgba(14, 165, 233, 0.4)' }]} />
                <Text style={styles.barLabel}>{bar.time}</Text>
              </View>
            ))}
          </View>

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#0ea5e9' }]} />
              <Text style={styles.legendText}>Highest Stress</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: 'rgba(14, 165, 233, 0.4)' }]} />
              <Text style={styles.legendText}>Baseline</Text>
            </View>
          </View>
        </View>

        {/* Correlations */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
          <View style={styles.correlationCard}>
            <View style={[styles.corrIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Moon size={24} color="#6366f1" />
            </View>
            <Text style={styles.corrTitle}>Sleep</Text>
            <Text style={styles.corrDesc}>Scores are 15% lower when you achieve &gt;7.5h sleep.</Text>
          </View>
          
          <View style={styles.correlationCard}>
            <View style={[styles.corrIconBox, { backgroundColor: 'rgba(234, 88, 12, 0.1)' }]}>
              <Dumbbell size={24} color="#ea580c" />
            </View>
            <Text style={styles.corrTitle}>Activity</Text>
            <Text style={styles.corrDesc}>A 20-min walk reduces cortisol response by 22%.</Text>
          </View>
        </View>

        {/* Insight Card */}
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Insight: Morning Momentum</Text>
          <Text style={styles.insightText}>We've noticed your stress levels often rise sharply before noon. Try integrating a 5-minute mindfulness practice immediately after your morning coffee.</Text>
          <TouchableOpacity style={styles.btnInsight}>
            <Text style={styles.btnInsightText}>Schedule Routine</Text>
          </TouchableOpacity>
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
  title: { fontSize: 28, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#94A3B8', lineHeight: 24 },
  
  scoreCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginBottom: 16 },
  scoreTop: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  progressContainer: { width: 160, height: 160, justifyContent: 'center', alignItems: 'center' },
  progressTextContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  scoreValue: { fontSize: 40, fontWeight: 'bold', color: '#10b981' },
  scoreLabel: { fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 'bold' },
  scoreInfo: { flex: 1 },
  statusBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 8 },
  statusBadgeText: { color: '#10b981', fontSize: 12, fontWeight: 'bold' },
  scoreDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 18 },

  actionButtons: { flexDirection: 'row', gap: 12 },
  btnPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#0ea5e9', paddingVertical: 12, borderRadius: 12 },
  btnPrimaryText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  btnSecondary: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  btnSecondaryText: { color: '#0ea5e9', fontSize: 14, fontWeight: 'bold' },

  deStressCard: { backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: 20, borderRadius: 16, marginBottom: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  deStressTitle: { fontSize: 18, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 4 },
  deStressDesc: { fontSize: 14, color: '#F8FAFC' },

  card: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 20 },
  
  chartContainer: { height: 160, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 8, marginBottom: 16 },
  barCol: { alignItems: 'center', flex: 1 },
  bar: { width: 16, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barLabel: { fontSize: 10, color: '#94A3B8', marginTop: 8 },

  chartLegend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: '#94A3B8' },

  correlationCard: { flex: 1, backgroundColor: '#1E293B', padding: 16, borderRadius: 16 },
  corrIconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  corrTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 8 },
  corrDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 18 },

  insightCard: { backgroundColor: '#1E293B', padding: 24, borderRadius: 16 },
  insightTitle: { fontSize: 18, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 12 },
  insightText: { fontSize: 14, color: '#F8FAFC', lineHeight: 22, marginBottom: 20 },
  btnInsight: { backgroundColor: '#0ea5e9', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnInsightText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
