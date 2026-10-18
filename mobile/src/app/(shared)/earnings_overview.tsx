import { router } from 'expo-router';
import { ArrowLeft, ArrowUpRight, TrendingUp, Wallet } from 'lucide-react-native';
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

export default function EarningsOverview() {
  const { authenticatedFetch } = useAuth();
  const [earnings, setEarnings] = useState<{ total_earnings: string; recent_transactions: any[] }>({
    total_earnings: '$0.00',
    recent_transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await authenticatedFetch('/api/billing/earnings');
        if (res.ok) {
          setEarnings(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Earnings & Settlements</Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            Clinician compensation and payouts
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={Palette.sagePrimary} size="large" />
          <Text style={{ marginTop: 12, color: theme.textSecondary, fontSize: 14 }}>
            Calculating settlement balance...
          </Text>
        </View>
      ) : (
        <FlatList
          data={earnings.recent_transactions || []}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContent}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews
          ListHeaderComponent={
            <View>
              {/* Hero Card */}
              <View
                style={[
                  styles.heroCard,
                  { backgroundColor: isDark ? Palette.surfaceDark1 : Palette.sagePrimary },
                ]}
              >
                <View style={styles.heroTop}>
                  <View>
                    <Text style={styles.heroLabel}>TOTAL SETTLED EARNINGS</Text>
                    <Text style={styles.heroAmount}>{earnings.total_earnings || '$0.00'}</Text>
                  </View>
                  <View style={styles.heroIconBox}>
                    <Wallet size={24} color="#ffffff" />
                  </View>
                </View>
                <View style={styles.heroFooter}>
                  <TrendingUp size={16} color={Palette.sageSubtle} style={{ marginRight: 6 }} />
                  <Text style={styles.heroFooterText}>Next scheduled automated payout: Friday</Text>
                </View>
              </View>

              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
            </View>
          }
          ListEmptyComponent={
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No Settlement Records</Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                Your consultation payouts will be reflected here after patient appointments
                conclude.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={[styles.txCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View
                style={[
                  styles.txIconBox,
                  { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
                ]}
              >
                <ArrowUpRight
                  size={18}
                  color={isDark ? Palette.sageLuminous : Palette.sagePrimary}
                />
              </View>
              <View style={{ flex: 1, marginRight: Spacing.two }}>
                <Text style={[styles.txTitle, { color: theme.text }]}>
                  {item.description || 'Clinical Consultation'}
                </Text>
                <Text style={[styles.txDate, { color: theme.textTertiary }]}>
                  {item.date || 'Recent'}
                </Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  { color: isDark ? Palette.sageLuminous : Palette.sagePrimary },
                ]}
              >
                +{item.amount || '$0.00'}
              </Text>
            </View>
          )}
        />
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
  listContent: { padding: Spacing.four, paddingBottom: 40 },
  heroCard: {
    padding: Spacing.five,
    borderRadius: Radius.lg,
    marginBottom: Spacing.five,
    elevation: 2,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  heroLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  heroAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
  },
  heroIconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: Spacing.three,
  },
  heroFooterText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.three },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.two,
  },
  txIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  txTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  txDate: { fontSize: 12 },
  txAmount: { fontSize: 16, fontWeight: '700' },
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
