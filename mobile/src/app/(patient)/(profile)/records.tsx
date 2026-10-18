import { router } from 'expo-router';
import { ArrowLeft, Download, FileText, Upload } from 'lucide-react-native';
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
import { Colors, Palette, Radius, Spacing } from '../../../constants/theme';
import { useAuth } from '../../../context/useAuth';

export default function MedicalRecords() {
  const { authenticatedFetch } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await authenticatedFetch('/api/tracker/records');
        if (res.ok) {
          const data = await res.json();
          setRecords(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [authenticatedFetch]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Medical Records</Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            Diagnostic PDFs, charts & clinical notes
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: Spacing.four, paddingTop: Spacing.four }}>
        <TouchableOpacity
          style={[styles.uploadBtn, { backgroundColor: Palette.sagePrimary }]}
          onPress={() => alert('Opening encrypted document upload...')}
          activeOpacity={0.85}
        >
          <Upload size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.btnText}>Upload Diagnostic Record</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={Palette.sagePrimary} size="large" />
          <Text style={{ marginTop: 12, color: theme.textSecondary, fontSize: 14 }}>
            Accessing encrypted health vault...
          </Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.scrollContent}
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
              <FileText size={44} color={theme.textTertiary} style={{ marginBottom: 14 }} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No Records In Vault</Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                Electronic medical records, diagnostic lab panels, and clinician prescriptions will
                be securely archived here.
              </Text>
            </View>
          }
          renderItem={({ item: record }) => (
            <View
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
                  ]}
                >
                  <FileText size={20} color={isDark ? Palette.sageLuminous : Palette.sagePrimary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>
                    {record.title || 'Diagnostic Document'}
                  </Text>
                  <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
                    {record.type || record.record_type || 'Clinical Report'} •{' '}
                    {record.date ? new Date(record.date).toLocaleDateString() : 'Archived'}
                  </Text>
                </View>
              </View>
              {record.file_url ? (
                <TouchableOpacity
                  style={[
                    styles.viewBtn,
                    { backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2 },
                  ]}
                  onPress={() => alert(`Opening secure document viewer: ${record.title}`)}
                  activeOpacity={0.8}
                >
                  <Download
                    size={14}
                    color={isDark ? Palette.sageLuminous : Palette.sagePrimary}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.viewBtnText,
                      { color: isDark ? Palette.sageLuminous : Palette.sagePrimary },
                    ]}
                  >
                    Download Encrypted PDF
                  </Text>
                </TouchableOpacity>
              ) : null}
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
  headerSub: { fontSize: 12, marginTop: 2 },
  scrollContent: { padding: Spacing.four, paddingBottom: 60 },
  uploadBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: Radius.md,
    marginBottom: Spacing.two,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  card: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  cardSub: { fontSize: 12 },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: Radius.md,
    marginTop: Spacing.three,
  },
  viewBtnText: { fontWeight: '700', fontSize: 13 },
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
