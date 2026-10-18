import { router } from 'expo-router';
import { ArrowLeft, CheckCircle, Clock, Download, Receipt } from 'lucide-react-native';
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

export default function BillingInvoices() {
  const { authenticatedFetch } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await authenticatedFetch('/api/billing/invoices');
        if (res.ok) {
          setInvoices(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Billing & Invoices</Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            Consultation statements & receipts
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={Palette.sagePrimary} size="large" />
          <Text style={{ marginTop: 12, color: theme.textSecondary, fontSize: 14 }}>
            Loading statements...
          </Text>
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews
          ListEmptyComponent={
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Receipt size={40} color={theme.textTertiary} style={{ marginBottom: 12 }} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No Invoices Found</Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                All completed consultation charges and pharmacy invoices will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isSuccess = item.status === 'Success' || item.status === 'Paid';
            return (
              <View
                style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                      {item.date || 'Recent'}
                    </Text>
                    <Text style={[styles.amountText, { color: theme.text }]}>
                      {item.amount || '$0.00'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isSuccess
                          ? isDark
                            ? 'rgba(64, 145, 108, 0.2)'
                            : Palette.sageSubtle
                          : isDark
                            ? 'rgba(224, 159, 62, 0.15)'
                            : Palette.warningSubtle,
                      },
                    ]}
                  >
                    {isSuccess ? (
                      <CheckCircle
                        size={12}
                        color={isDark ? Palette.sageLuminous : Palette.sagePrimary}
                        style={{ marginRight: 4 }}
                      />
                    ) : (
                      <Clock size={12} color={Palette.warning} style={{ marginRight: 4 }} />
                    )}
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: isSuccess
                            ? isDark
                              ? Palette.sageLuminous
                              : Palette.sagePrimary
                            : Palette.warning,
                        },
                      ]}
                    >
                      {item.status || 'Pending'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                  <Text style={[styles.typeText, { color: theme.textTertiary }]}>
                    {item.type || 'Consultation Service'}
                  </Text>
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() => alert('Downloading official receipt PDF...')}
                    activeOpacity={0.7}
                  >
                    <Download
                      size={14}
                      color={isDark ? Palette.sageLuminous : Palette.sagePrimary}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.downloadText,
                        { color: isDark ? Palette.sageLuminous : Palette.sagePrimary },
                      ]}
                    >
                      Receipt
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
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
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    marginBottom: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.three,
  },
  dateText: { fontSize: 12, fontWeight: '500', marginBottom: 2 },
  amountText: { fontSize: 20, fontWeight: '700' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  statusText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  typeText: { fontSize: 13 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  downloadText: { fontSize: 13, fontWeight: '600' },
  emptyCard: {
    padding: Spacing.eight,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: Spacing.six,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
