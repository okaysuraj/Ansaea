import { router } from 'expo-router';
import { Activity, ArrowLeft, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../context/useAuth';

export default function BloodPressureHistory() {
  const { authenticatedFetch } = useAuth();
  const [vitals, setVitals] = useState<any[]>([]);

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
      }
    };
    fetchVitals();
  }, [authenticatedFetch]);

  const displayReadings = vitals.map((v, i) => {
    let sys = 120,
      dia = 80;
    if (v.blood_pressure && v.blood_pressure.includes('/')) {
      const parts = v.blood_pressure.split('/');
      sys = parseInt(parts[0]) || 120;
      dia = parseInt(parts[1]) || 80;
    }
    const status = sys > 130 || dia > 85 ? 'High' : sys > 120 ? 'Elevated' : 'Normal';
    return {
      id: v.id || i,
      date: v.date
        ? new Date(v.date).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Recent',
      sys,
      dia,
      status,
    };
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Normal':
        return { bg: 'rgba(22, 163, 74, 0.1)', text: '#16a34a', border: '#16a34a' };
      case 'Elevated':
        return { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308', border: '#eab308' };
      default:
        return { bg: 'rgba(220, 38, 38, 0.1)', text: '#dc2626', border: '#dc2626' };
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
        {/* Summary Metric Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Latest Reading</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4, gap: 6 }}>
            <Text style={styles.summaryVal}>
              {displayReadings.length > 0
                ? `${displayReadings[0].sys}/${displayReadings[0].dia}`
                : '—/—'}
            </Text>
            <Text style={styles.summaryUnit}>mmHg</Text>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recorded History ({displayReadings.length})</Text>
        </View>

        {/* Readings List */}
        <View style={styles.readingsList}>
          {displayReadings.length === 0 ? (
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Activity size={36} color="#64748B" style={{ marginBottom: 12 }} />
              <Text style={{ color: '#94A3B8', fontSize: 16 }}>
                No blood pressure records found.
              </Text>
              <Text style={{ color: '#64748B', fontSize: 13, marginTop: 4, textAlign: 'center' }}>
                Tap the + button below to log your clinical systolic and diastolic pressure.
              </Text>
            </View>
          ) : (
            displayReadings.map((reading) => {
              const style = getStatusStyle(reading.status);
              return (
                <TouchableOpacity key={reading.id} style={styles.readingCard}>
                  <View style={styles.readingLeft}>
                    <View style={[styles.statusIndicator, { backgroundColor: style.border }]} />
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                        <Text style={styles.readingSys}>{reading.sys}</Text>
                        <Text style={styles.readingSlash}>/</Text>
                        <Text style={styles.readingDia}>{reading.dia}</Text>
                        <Text style={styles.readingUnit}>mmHg</Text>
                      </View>
                      <Text style={styles.readingDate}>{reading.date}</Text>
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: style.text }]}>
                      {reading.status}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' },
  scroll: { padding: 20, paddingBottom: 100 },
  summaryCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  summaryLabel: { color: '#94A3B8', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryVal: { color: '#F8FAFC', fontSize: 36, fontWeight: 'bold' },
  summaryUnit: { color: '#94A3B8', fontSize: 16 },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },
  readingsList: { gap: 12 },
  readingCard: {
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
  readingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusIndicator: { width: 4, height: 36, borderRadius: 2 },
  readingSys: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold' },
  readingSlash: { color: '#64748B', fontSize: 18 },
  readingDia: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold' },
  readingUnit: { color: '#94A3B8', fontSize: 14, marginLeft: 2 },
  readingDate: { color: '#64748B', fontSize: 12, marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontSize: 12, fontWeight: 'bold' },
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
