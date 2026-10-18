import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Users } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Colors, Palette, Radius, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/useAuth';

export default function PatientRoster() {
  const { authenticatedFetch } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const res = await authenticatedFetch('/api/doctors/roster');
        if (res.ok) {
          const data = await res.json();
          setPatients(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRoster();
  }, [authenticatedFetch]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Patient Roster</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={Palette.sagePrimary} size="large" />
          <Text style={{ marginTop: 12, color: theme.textSecondary, fontSize: 14 }}>
            Loading clinician caseload...
          </Text>
        </View>
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.scrollContent}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Users size={40} color={theme.textTertiary} style={{ marginBottom: 12 }} />
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
                No Active Caseload
              </Text>
              <Text
                style={{
                  color: theme.textSecondary,
                  fontSize: 13,
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                Patients booked for clinical review will appear in this roster.
              </Text>
            </View>
          }
          renderItem={({ item: patient }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => router.push(`/consultation_workspace?patientId=${patient.id}` as any)}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.three }}>
                <View style={[styles.avatar, { backgroundColor: Palette.sagePrimary }]}>
                  <Text style={styles.avatarText}>
                    {patient.name ? patient.name.substring(0, 2).toUpperCase() : 'PT'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>
                    {patient.name || 'Anonymous Patient'}
                  </Text>
                  <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
                    Last Encounter: {patient.lastSeen || 'Scheduled'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        patient.status === 'Stable'
                          ? isDark
                            ? 'rgba(64, 145, 108, 0.2)'
                            : Palette.sageSubtle
                          : isDark
                            ? 'rgba(193, 41, 46, 0.15)'
                            : Palette.dangerSubtle,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color:
                          patient.status === 'Stable'
                            ? isDark
                              ? Palette.sageLuminous
                              : Palette.sagePrimary
                            : Palette.danger,
                      },
                    ]}
                  >
                    {patient.status || 'Active'}
                  </Text>
                </View>
                <ChevronRight size={16} color={theme.textTertiary} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: 56,
    paddingBottom: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: Spacing.four, paddingBottom: 60 },
  card: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.two,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  cardSub: { fontSize: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
  badgeText: { fontSize: 11, fontWeight: '700' },
});
