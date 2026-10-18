import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/useAuth';

export default function PatientProfileMobileView() {
  const { id } = useLocalSearchParams();
  const { authenticatedFetch } = useAuth();

  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authenticatedFetch(`/api/doctors/patients/${id}/history`);
        if (res.ok) {
          const data = await res.json();
          setPatientData(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHistory();
  }, [id, authenticatedFetch]);

  const pId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : 'Patient';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#0ea5e9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clinical Record</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0ea5e9" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Profile Info */}
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>PT</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.name}>Patient Record</Text>
                <Text style={styles.subtext}>
                  ID: {pId.substring(0, 8)} • Blood: {patientData?.profile?.blood_group || 'O+'}
                </Text>
              </View>
            </View>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
                <MessageCircle size={20} color="#fff" />
                <Text style={styles.btnText}>Messages</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => router.push('/(shared)/video_call' as any)}
              >
                <Phone size={20} color="#0ea5e9" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Chronic Conditions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Chronic Conditions</Text>
            {patientData?.history?.chronic_conditions?.length > 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {patientData.history.chronic_conditions.map((cond: string, i: number) => (
                  <View key={i} style={styles.conditionChip}>
                    <Text style={styles.conditionText}>{cond}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ color: '#94A3B8', marginTop: 8 }}>
                No chronic conditions on record.
              </Text>
            )}
          </View>

          {/* Allergies */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Documented Allergies</Text>
            {patientData?.history?.allergies?.length > 0 ? (
              <View style={{ gap: 8, marginTop: 10 }}>
                {patientData.history.allergies.map((allergy: any, i: number) => (
                  <View key={i} style={styles.allergyRow}>
                    <Text style={{ color: '#F8FAFC', fontWeight: 'bold' }}>
                      {typeof allergy === 'object' ? allergy.name : allergy}
                    </Text>
                    <Text style={{ color: '#ef4444', fontSize: 12 }}>
                      {typeof allergy === 'object' ? allergy.severity : 'Documented'}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ color: '#94A3B8', marginTop: 8 }}>No allergies recorded.</Text>
            )}
          </View>

          {/* Past Surgeries */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Past Surgeries</Text>
            {patientData?.history?.past_surgeries?.length > 0 ? (
              <View style={{ gap: 8, marginTop: 10 }}>
                {patientData.history.past_surgeries.map((surg: any, i: number) => (
                  <View key={i} style={styles.allergyRow}>
                    <Text style={{ color: '#F8FAFC', fontWeight: '600' }}>
                      {typeof surg === 'object' ? surg.name : surg}
                    </Text>
                    <Text style={{ color: '#94A3B8', fontSize: 12 }}>
                      {typeof surg === 'object' ? surg.year : ''}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ color: '#94A3B8', marginTop: 8 }}>
                No surgical procedures recorded.
              </Text>
            )}
          </View>
        </ScrollView>
      )}
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
  headerTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' },
  scroll: { padding: 20 },
  card: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  avatarText: { color: '#0ea5e9', fontSize: 20, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  name: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' },
  subtext: { color: '#94A3B8', fontSize: 13, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0ea5e9',
    padding: 12,
    borderRadius: 10,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  secondaryBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },
  conditionChip: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  conditionText: { color: '#0ea5e9', fontSize: 13, fontWeight: '600' },
  allergyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
});
