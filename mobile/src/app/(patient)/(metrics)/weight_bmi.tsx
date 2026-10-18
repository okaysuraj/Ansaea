import { router } from 'expo-router';
import { Activity, ArrowLeft, Plus, Target } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../context/useAuth';

export default function WeightBmiTracker() {
  const { authenticatedFetch } = useAuth();
  const [vitals, setVitals] = useState<any[]>([]);

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
      }
    };
    fetchVitals();
  }, [authenticatedFetch]);

  const displayReadings = vitals.map((v, i) => ({
    id: v.id || i,
    date: v.date
      ? new Date(v.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Recent',
    time: v.date
      ? new Date(v.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Logged',
    bmi: v.bmi,
    status:
      v.bmi < 18.5
        ? 'Underweight'
        : v.bmi <= 24.9
          ? 'Normal'
          : v.bmi <= 29.9
            ? 'Overweight'
            : 'Obese',
  }));

  const latestBmi = displayReadings.length > 0 ? displayReadings[0].bmi : null;

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
        {/* Current BMI Hero Section */}
        <View style={styles.heroSection}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <View>
              <Text style={styles.heroLabel}>Latest BMI Metric</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                <Text style={styles.heroValue}>{latestBmi ? latestBmi : '—'}</Text>
                <Text style={styles.heroUnit}>kg/m²</Text>
              </View>
            </View>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {displayReadings.length > 0 ? displayReadings[0].status : 'No Data'}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Logs */}
        <View style={styles.section}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={styles.sectionTitle}>Recorded History ({displayReadings.length})</Text>
          </View>

          {displayReadings.length === 0 ? (
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Activity size={36} color="#64748B" style={{ marginBottom: 12 }} />
              <Text style={{ color: '#94A3B8', fontSize: 16 }}>No BMI records recorded.</Text>
              <Text style={{ color: '#64748B', fontSize: 13, marginTop: 4, textAlign: 'center' }}>
                Tap the + button below to log your biometric calibration.
              </Text>
            </View>
          ) : (
            displayReadings.map((reading) => (
              <View key={reading.id} style={styles.logCard}>
                <View style={styles.logLeft}>
                  <View style={styles.logIcon}>
                    <Target size={20} color="#0ea5e9" />
                  </View>
                  <View>
                    <Text style={styles.logDate}>{reading.date}</Text>
                    <Text style={styles.logTime}>{reading.time}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.logWeight}>{reading.bmi} kg/m²</Text>
                  <Text style={{ color: '#0ea5e9', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                    {reading.status}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(patient)/(metrics)/vitals' as any)}
      >
        <Plus size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  scroll: { padding: 16, paddingBottom: 100 },
  heroSection: {
    marginBottom: 24,
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  heroLabel: { fontSize: 14, color: '#94A3B8', marginBottom: 4 },
  heroValue: { fontSize: 40, fontWeight: 'bold', color: '#0ea5e9' },
  heroUnit: { fontSize: 18, color: '#94A3B8' },
  badgeContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: { color: '#10b981', fontSize: 12, fontWeight: 'bold' },
  section: { marginTop: 12 },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },
  logCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logDate: { color: '#F8FAFC', fontSize: 15, fontWeight: 'bold' },
  logTime: { color: '#64748B', fontSize: 12, marginTop: 2 },
  logWeight: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
