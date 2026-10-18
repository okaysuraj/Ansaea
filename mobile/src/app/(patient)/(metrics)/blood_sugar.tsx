import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Droplet, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../context/useAuth';

export default function BloodSugarHistory() {
  const { authenticatedFetch } = useAuth();
  const [vitals, setVitals] = useState<any[]>([]);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const res = await authenticatedFetch('/api/patients/vitals');
        if (res.ok) {
          const data = await res.json();
          setVitals(data.filter((d: any) => d.blood_sugar));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchVitals();
  }, [authenticatedFetch]);

  const displayReadings = vitals.map((v, i) => ({
    id: v.id || i,
    date: v.date ? new Date(v.date).toLocaleDateString() : 'Recent',
    time: v.date
      ? new Date(v.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Logged',
    type: 'Blood Glucose',
    value: v.blood_sugar,
    icon: 'Droplet',
    status: v.blood_sugar > 140 ? 'High' : 'Optimal',
  }));

  const getIcon = () => {
    return <Droplet size={24} color="#0ea5e9" />;
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
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <Text style={styles.summaryLabel}>Latest Reading</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4, gap: 4 }}>
                <Text style={styles.summaryVal}>
                  {displayReadings.length > 0 ? displayReadings[0].value : '—'}
                </Text>
                <Text style={styles.summaryUnit}>mg/dL</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: 'rgba(22, 163, 74, 0.1)' }]}>
              <Text style={[styles.statusBadgeText, { color: '#16a34a' }]}>
                {displayReadings.length > 0 ? displayReadings[0].status : 'No Data'}
              </Text>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reading History ({displayReadings.length})</Text>
        </View>

        {/* Readings List */}
        <View style={styles.readingsList}>
          {displayReadings.length === 0 ? (
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Droplet size={36} color="#64748B" style={{ marginBottom: 12 }} />
              <Text style={{ color: '#94A3B8', fontSize: 16 }}>
                No blood sugar readings recorded.
              </Text>
              <Text style={{ color: '#64748B', fontSize: 13, marginTop: 4, textAlign: 'center' }}>
                Tap the + button below to log your glucose level into your health chart.
              </Text>
            </View>
          ) : (
            displayReadings.map((reading, index) => {
              const showDateHeader =
                index === 0 || reading.date !== displayReadings[index - 1].date;
              return (
                <View key={reading.id}>
                  {showDateHeader && <Text style={styles.dateHeader}>{reading.date}</Text>}

                  <TouchableOpacity style={styles.readingCard}>
                    <View style={styles.readingLeft}>
                      <View style={styles.iconWrapper}>{getIcon()}</View>
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                          <Text
                            style={[
                              styles.readingVal,
                              reading.status === 'High' && { color: '#ef4444' },
                            ]}
                          >
                            {reading.value}
                          </Text>
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
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontSize: 12, fontWeight: 'bold' },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },
  readingsList: { gap: 12 },
  dateHeader: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 8,
  },
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
  readingLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readingVal: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold' },
  readingUnit: { color: '#94A3B8', fontSize: 14 },
  readingMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  typeBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: { color: '#94A3B8', fontSize: 11, fontWeight: '500' },
  timeText: { color: '#64748B', fontSize: 12 },
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
