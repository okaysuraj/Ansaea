import { router } from 'expo-router';
import {
  Activity,
  ArrowLeft,
  Bell,
  ChevronRight,
  Droplets,
  Heart,
  Lightbulb,
  Plus,
  Weight,
  Wind,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../../context/useAuth';

export default function HealthMetrics() {
  const { authenticatedFetch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [latestVitals, setLatestVitals] = useState<{
    heartRate?: number | string;
    bloodPressure?: string;
    spo2?: number | string;
    bloodSugar?: number | string;
    weight?: number | string;
  }>({});

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const res = await authenticatedFetch('/api/tracker/vitals');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const summary: any = {};
            for (const v of data) {
              // Direct flat properties as returned by backend VitalSignOut
              if (v.heart_rate != null && !summary.heartRate) summary.heartRate = v.heart_rate;
              if (v.blood_pressure && !summary.bloodPressure)
                summary.bloodPressure = v.blood_pressure;
              if (v.spo2 != null && !summary.spo2) summary.spo2 = v.spo2;
              if (v.blood_sugar != null && !summary.bloodSugar) summary.bloodSugar = v.blood_sugar;
              if (v.bmi != null && !summary.weight) summary.weight = `${v.bmi} BMI`;

              // Legacy or alternative nested structures fallback
              if (v.vital_type === 'heart_rate' && !summary.heartRate) {
                summary.heartRate = v.value_primary;
              } else if (v.vital_type === 'blood_pressure' && !summary.bloodPressure) {
                summary.bloodPressure = v.value_secondary
                  ? `${Math.round(v.value_primary)}/${Math.round(v.value_secondary)}`
                  : `${Math.round(v.value_primary)}`;
              } else if (
                (v.vital_type === 'spo2' || v.vital_type === 'oxygen_saturation') &&
                !summary.spo2
              ) {
                summary.spo2 = v.value_primary;
              } else if (v.vital_type === 'blood_sugar' && !summary.bloodSugar) {
                summary.bloodSugar = v.value_primary;
              } else if (v.vital_type === 'weight' && !summary.weight) {
                summary.weight = v.value_primary;
              }
            }
            setLatestVitals(summary);
          }
        }
      } catch (err) {
        console.error('Failed to load vitals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVitals();
  }, [authenticatedFetch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Metrics</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push('/(shared)/notification_settings')}
        >
          <Bell size={24} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            Real-time biometric data from your electronic health record.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0ea5e9" style={{ marginVertical: 40 }} />
        ) : (
          <View style={styles.grid}>
            {/* Heart Rate */}
            <TouchableOpacity
              style={[styles.card, styles.cardFull]}
              onPress={() => router.push('/(patient)/(metrics)/vitals')}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconRow}>
                  <Heart size={20} color="#ef4444" />
                  <Text style={styles.cardTitle}>Heart Rate</Text>
                </View>
                <View style={styles.badgeNormal}>
                  <Text style={styles.badgeTextNormal}>
                    {latestVitals.heartRate ? 'Recorded' : 'Pending'}
                  </Text>
                </View>
              </View>
              <View style={styles.valueRow}>
                <Text style={styles.value}>{latestVitals.heartRate ?? '--'}</Text>
                <Text style={styles.unit}>BPM</Text>
              </View>
              <View style={styles.actionPrompt}>
                <Text style={styles.actionPromptText}>Tap to log heart rate</Text>
                <ChevronRight size={14} color="#0ea5e9" />
              </View>
            </TouchableOpacity>

            {/* Blood Pressure */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/(patient)/(metrics)/blood_pressure')}
            >
              <View style={styles.iconRow}>
                <Activity size={20} color="#0ea5e9" />
                <Text style={styles.cardTitle}>Blood Pressure</Text>
              </View>
              <View style={[styles.valueRow, { marginTop: 16 }]}>
                <Text style={styles.valueSmall}>{latestVitals.bloodPressure ?? '--'}</Text>
                <Text style={styles.unit}>mmHg</Text>
              </View>
              <View style={[styles.badgeNormal, { marginTop: 16, alignSelf: 'flex-start' }]}>
                <Text style={styles.badgeTextNormal}>
                  {latestVitals.bloodPressure ? 'Logged' : 'No Data'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* SpO2 */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/(patient)/(metrics)/vitals')}
            >
              <View style={styles.iconRow}>
                <Wind size={20} color="#6366f1" />
                <Text style={styles.cardTitle}>SpO2</Text>
              </View>
              <View style={[styles.valueRow, { marginTop: 16 }]}>
                <Text style={styles.valueSmall}>{latestVitals.spo2 ?? '--'}</Text>
                <Text style={styles.unit}>%</Text>
              </View>
              <View style={[styles.badgeNormal, { marginTop: 16, alignSelf: 'flex-start' }]}>
                <Text style={styles.badgeTextNormal}>
                  {latestVitals.spo2 ? 'Logged' : 'No Data'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Blood Sugar */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/(patient)/(metrics)/blood_sugar')}
            >
              <View style={styles.iconRow}>
                <Droplets size={20} color="#10b981" />
                <Text style={styles.cardTitle}>Blood Sugar</Text>
              </View>
              <View style={[styles.valueRow, { marginTop: 16 }]}>
                <Text style={styles.valueSmall}>{latestVitals.bloodSugar ?? '--'}</Text>
                <Text style={styles.unit}>mg/dL</Text>
              </View>
              <View style={[styles.badgeNormal, { marginTop: 16, alignSelf: 'flex-start' }]}>
                <Text style={styles.badgeTextNormal}>
                  {latestVitals.bloodSugar ? 'Logged' : 'No Data'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Weight */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/(patient)/(metrics)/weight_bmi')}
            >
              <View style={styles.iconRow}>
                <Weight size={20} color="#94A3B8" />
                <Text style={styles.cardTitle}>Weight</Text>
              </View>
              <View style={[styles.valueRow, { marginTop: 16 }]}>
                <Text style={styles.valueSmall}>{latestVitals.weight ?? '--'}</Text>
                <Text style={styles.unit}>kg/lbs</Text>
              </View>
              <View style={[styles.badgeNormal, { marginTop: 16, alignSelf: 'flex-start' }]}>
                <Text style={styles.badgeTextNormal}>
                  {latestVitals.weight ? 'Logged' : 'No Data'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.btnAdd}
          onPress={() => router.push('/(patient)/(metrics)/vitals')}
        >
          <Plus size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.btnAddText}>Add Biometric Reading</Text>
        </TouchableOpacity>

        <View style={styles.insightSection}>
          <Text style={styles.sectionTitle}>Daily Clinical Insight</Text>
          <View style={styles.insightCard}>
            <Lightbulb size={32} color="#8b5cf6" />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.insightTitle}>Proactive Monitoring</Text>
              <Text style={styles.insightDesc}>
                Regular vitals recordings enable your clinical care team to detect anomalies early
                and personalize treatment protocols.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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

  titleSection: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#94A3B8' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  card: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardFull: { width: '100%' },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 14, color: '#F8FAFC', fontWeight: '500' },

  badgeNormal: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextNormal: { color: '#10b981', fontSize: 10, fontWeight: 'bold' },

  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  value: { fontSize: 32, fontWeight: 'bold', color: '#F8FAFC' },
  valueSmall: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC' },
  unit: { fontSize: 14, color: '#94A3B8' },

  actionPrompt: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  actionPromptText: { color: '#0ea5e9', fontSize: 12, fontWeight: '600' },

  btnAdd: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  btnAddText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  insightSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 16 },
  insightCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
  },
  insightTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  insightDesc: { fontSize: 14, color: '#94A3B8', lineHeight: 20 },
});
