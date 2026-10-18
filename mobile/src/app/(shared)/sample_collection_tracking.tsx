import { router } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FlaskConical,
  Phone,
  Truck,
  User,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Colors, Palette, Radius, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/useAuth';

export default function SampleCollectionTracking() {
  const { authenticatedFetch } = useAuth();
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await authenticatedFetch('/api/lab/sample-tracking');
        if (res.ok) setTracking(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, [authenticatedFetch]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Sample Collection</Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            Diagnostic specimen courier tracking
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={Palette.sagePrimary} size="large" />
          <Text style={{ marginTop: 12, color: theme.textSecondary, fontSize: 14 }}>
            Connecting to courier telemetry...
          </Text>
        </View>
      ) : !tracking ? (
        <View style={{ padding: Spacing.six }}>
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <FlaskConical size={40} color={theme.textTertiary} style={{ marginBottom: 12 }} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Active Dispatches</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
              When your physician orders home lab tests, doorstep sample collection status will be
              tracked live here.
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Status Card */}
          <View
            style={[
              styles.statusCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.statusHeader}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
                ]}
              >
                <Truck size={24} color={isDark ? Palette.sageLuminous : Palette.sagePrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.statusLabel, { color: theme.textTertiary }]}>
                  DISPATCH STATUS
                </Text>
                <Text
                  style={[
                    styles.statusValue,
                    { color: isDark ? Palette.sageLuminous : Palette.sagePrimary },
                  ]}
                >
                  {tracking.status || 'Phlebotomist En Route'}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.etaBox,
                { backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2 },
              ]}
            >
              <Clock
                size={16}
                color={isDark ? Palette.sageLuminous : Palette.sagePrimary}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.etaText, { color: theme.text }]}>
                Estimated Arrival:{' '}
                <Text style={{ fontWeight: '700' }}>{tracking.eta || 'Within 30 mins'}</Text>
              </Text>
            </View>
          </View>

          {/* Agent Details Card */}
          <View
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Assigned Phlebotomist</Text>
            <View style={styles.agentRow}>
              <View
                style={[
                  styles.agentAvatar,
                  { backgroundColor: isDark ? Palette.surfaceDark3 : Palette.surfaceWarm3 },
                ]}
              >
                <User size={20} color={theme.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.agentName, { color: theme.text }]}>
                  {tracking.agent || 'Certified Clinical Officer'}
                </Text>
                <Text style={[styles.agentBadge, { color: theme.textTertiary }]}>
                  Verified Diagnostic Phlebotomist
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.phoneBtn, { backgroundColor: Palette.sagePrimary }]}
                onPress={() => alert('Connecting to phlebotomist...')}
                activeOpacity={0.8}
              >
                <Phone size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tests in Order */}
          <View
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Scheduled Test Specimen
            </Text>
            {(tracking.test_names || ['Complete Blood Count (CBC)', 'Lipid Profile']).map(
              (test: string, idx: number) => (
                <View
                  key={idx}
                  style={[
                    styles.testItem,
                    idx > 0 && {
                      borderTopWidth: 1,
                      borderTopColor: theme.border,
                      paddingTop: Spacing.three,
                      marginTop: Spacing.three,
                    },
                  ]}
                >
                  <CheckCircle2
                    size={16}
                    color={Palette.success}
                    style={{ marginRight: 8, marginTop: 2 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.testName, { color: theme.text }]}>{test}</Text>
                    <Text style={[styles.testSub, { color: theme.textSecondary }]}>
                      Fasting required • Cold storage kit
                    </Text>
                  </View>
                </View>
              ),
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: 56,
    paddingBottom: Spacing.four,
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSub: { fontSize: 12, marginTop: 2 },
  scroll: { padding: Spacing.four, paddingBottom: 60 },
  statusCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.five,
    marginBottom: Spacing.four,
    borderLeftWidth: 4,
    borderLeftColor: Palette.sagePrimary,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 2 },
  statusValue: { fontSize: 20, fontWeight: '800' },
  etaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.md,
  },
  etaText: { fontSize: 13 },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.five,
    marginBottom: Spacing.four,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.four },
  agentRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  agentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  agentBadge: { fontSize: 12 },
  phoneBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testItem: { flexDirection: 'row', alignItems: 'flex-start' },
  testName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  testSub: { fontSize: 12 },
  emptyCard: {
    padding: Spacing.eight,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
