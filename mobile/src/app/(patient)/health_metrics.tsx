import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Heart, Activity, Wind, Droplets, ArrowLeft, Bell, Lightbulb, Plus, Weight } from 'lucide-react-native';

export default function HealthMetrics() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Metrics</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Bell size={24} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.titleSection}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Your vitals are looking stable today.</Text>
        </View>

        <View style={styles.grid}>
          
          {/* Heart Rate */}
          <View style={[styles.card, styles.cardFull]}>
            <View style={styles.cardHeader}>
              <View style={styles.iconRow}>
                <Heart size={20} color="#ef4444" />
                <Text style={styles.cardTitle}>Heart Rate</Text>
              </View>
              <View style={styles.badgeNormal}><Text style={styles.badgeTextNormal}>Normal</Text></View>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.value}>72</Text>
              <Text style={styles.unit}>BPM</Text>
            </View>
            <View style={styles.chartPlaceholder}>
              <View style={[styles.bar, { height: '40%' }]} />
              <View style={[styles.bar, { height: '60%' }]} />
              <View style={[styles.bar, { height: '50%' }]} />
              <View style={[styles.bar, { height: '70%' }]} />
              <View style={[styles.bar, { height: '45%' }]} />
              <View style={[styles.bar, { height: '55%' }]} />
              <View style={[styles.bar, { height: '65%', backgroundColor: '#0ea5e9' }]} />
            </View>
          </View>

          {/* Blood Pressure */}
          <View style={styles.card}>
            <View style={styles.iconRow}>
              <Activity size={20} color="#0ea5e9" />
              <Text style={styles.cardTitle}>Blood Pressure</Text>
            </View>
            <View style={[styles.valueRow, { marginTop: 16 }]}>
              <Text style={styles.valueSmall}>118/76</Text>
              <Text style={styles.unit}>mmHg</Text>
            </View>
            <View style={[styles.badgeNormal, { marginTop: 16, alignSelf: 'flex-start' }]}>
              <Text style={styles.badgeTextNormal}>Optimal</Text>
            </View>
          </View>

          {/* SpO2 */}
          <View style={styles.card}>
            <View style={styles.iconRow}>
              <Wind size={20} color="#6366f1" />
              <Text style={styles.cardTitle}>SpO2</Text>
            </View>
            <View style={[styles.valueRow, { marginTop: 16 }]}>
              <Text style={styles.valueSmall}>98</Text>
              <Text style={styles.unit}>%</Text>
            </View>
            <View style={[styles.badgeNormal, { marginTop: 16, alignSelf: 'flex-start' }]}>
              <Text style={styles.badgeTextNormal}>Normal</Text>
            </View>
          </View>

          {/* Blood Sugar */}
          <View style={styles.card}>
            <View style={styles.iconRow}>
              <Droplets size={20} color="#10b981" />
              <Text style={styles.cardTitle}>Blood Sugar</Text>
            </View>
            <View style={[styles.valueRow, { marginTop: 16 }]}>
              <Text style={styles.valueSmall}>94</Text>
              <Text style={styles.unit}>mg/dL</Text>
            </View>
            <View style={[styles.badgeNormal, { marginTop: 16, alignSelf: 'flex-start' }]}>
              <Text style={styles.badgeTextNormal}>Stable</Text>
            </View>
          </View>

          {/* Weight */}
          <View style={styles.card}>
            <View style={styles.iconRow}>
              <Weight size={20} color="#94A3B8" />
              <Text style={styles.cardTitle}>Weight</Text>
            </View>
            <View style={[styles.valueRow, { marginTop: 16 }]}>
              <Text style={styles.valueSmall}>150.8</Text>
              <Text style={styles.unit}>lbs</Text>
            </View>
            <Text style={{ color: '#10b981', fontSize: 12, marginTop: 16, fontWeight: 'bold' }}>-0.4 lbs vs last week</Text>
          </View>

        </View>

        <TouchableOpacity style={styles.btnAdd}>
          <Plus size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.btnAddText}>Add Reading</Text>
        </TouchableOpacity>

        <View style={styles.insightSection}>
          <Text style={styles.sectionTitle}>Daily Insight</Text>
          <View style={styles.insightCard}>
            <Lightbulb size={32} color="#8b5cf6" />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.insightTitle}>Consistency pays off!</Text>
              <Text style={styles.insightDesc}>Your blood pressure has remained in the optimal range for 7 consecutive days. Keep up the good hydration.</Text>
            </View>
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
  
  titleSection: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#94A3B8' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  card: { width: '48%', backgroundColor: '#1E293B', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155' },
  cardFull: { width: '100%' },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 14, color: '#F8FAFC', fontWeight: '500' },
  
  badgeNormal: { backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeTextNormal: { color: '#10b981', fontSize: 10, fontWeight: 'bold' },

  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  value: { fontSize: 32, fontWeight: 'bold', color: '#F8FAFC' },
  valueSmall: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC' },
  unit: { fontSize: 14, color: '#94A3B8' },

  chartPlaceholder: { flexDirection: 'row', alignItems: 'flex-end', height: 48, gap: 4, marginTop: 16 },
  bar: { flex: 1, backgroundColor: 'rgba(14, 165, 233, 0.2)', borderTopLeftRadius: 4, borderTopRightRadius: 4 },

  btnAdd: { backgroundColor: '#0ea5e9', paddingVertical: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  btnAddText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  insightSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 16 },
  insightCard: { backgroundColor: 'rgba(139, 92, 246, 0.1)', borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.3)', borderRadius: 16, padding: 20, flexDirection: 'row' },
  insightTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  insightDesc: { fontSize: 14, color: '#94A3B8', lineHeight: 20 }
});
