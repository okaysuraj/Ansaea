import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, FileText, Search, User } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Palette, Radius, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/useAuth';

export default function PatientList() {
  const { authenticatedFetch } = useAuth();
  const [activeFilter, setActiveFilter] = useState('Assigned to Me');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const accentColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await authenticatedFetch('/api/doctors/patients');
        if (res.ok) {
          const data = await res.json();
          setPatients(
            data.map((p: any) => ({
              id: `#PT-${(p.id || '1001').substring(0, 4).toUpperCase()}`,
              name: p.name || 'Anonymous Patient',
              age: 45,
              gender: 'Adult',
              status: p.status || 'Active Care',
              statusColor: Palette.success,
              lastVisit: 'Recent Consultation',
              detailLabel: 'Contact',
              detailValue: p.email || 'Encrypted Chart',
              nextAction: 'Open Workspace',
              patientId: p.id,
            })),
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [authenticatedFetch]);

  const filteredPatients = patients.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.id || '').toLowerCase().includes(search.toLowerCase()),
  );

  const renderPatientCard = useCallback(
    ({ item: patient }: { item: any }) => (
      <TouchableOpacity
        style={[styles.patientCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => router.push(`/consultation_workspace?patientId=${patient.patientId}` as any)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.patientName, { color: theme.text }]}>{patient.name}</Text>
            <Text style={[styles.patientSub, { color: theme.textSecondary }]}>
              {patient.age} yrs • {patient.gender} • ID: {patient.id}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isDark ? 'rgba(64, 145, 108, 0.2)' : Palette.sageSubtle },
            ]}
          >
            <Text style={[styles.statusText, { color: accentColor }]}>{patient.status}</Text>
          </View>
        </View>

        <View style={[styles.cardMiddle, { borderColor: theme.border }]}>
          <View style={styles.middleCol}>
            <Text style={[styles.middleLabel, { color: theme.textTertiary }]}>LAST ENCOUNTER</Text>
            <Text style={[styles.middleVal, { color: theme.text }]}>{patient.lastVisit}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.middleCol}>
            <Text style={[styles.middleLabel, { color: theme.textTertiary }]}>
              {patient.detailLabel.toUpperCase()}
            </Text>
            <Text style={[styles.middleVal, { color: theme.text }]}>{patient.detailValue}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerLeft}>
            <FileText size={15} color={theme.textTertiary} />
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              {patient.nextAction}
            </Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={[styles.actionText, { color: accentColor }]}>Launch Workspace</Text>
            <ChevronRight size={15} color={accentColor} />
          </View>
        </View>
      </TouchableOpacity>
    ),
    [theme, isDark, accentColor],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={theme.text} />
          </TouchableOpacity>
          <View style={[styles.avatar, { backgroundColor: Palette.sagePrimary }]}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>DR</Text>
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Ansaea Clinician</Text>
            <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
              Active Patient Roster
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.searchSection,
          { backgroundColor: theme.surface, borderBottomColor: theme.border },
        ]}
      >
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
              borderColor: theme.border,
            },
          ]}
        >
          <Search size={18} color={theme.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search patients by name or ID..."
            placeholderTextColor={theme.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.filterRow}>
          {['Assigned to Me', 'All Clinical Charts'].map((filter) => {
            const isSel = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                    borderColor: theme.border,
                  },
                  isSel && {
                    backgroundColor: Palette.sagePrimary,
                    borderColor: Palette.sagePrimary,
                  },
                ]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: theme.textSecondary },
                    isSel && { color: '#FFF', fontWeight: '700' },
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Palette.sagePrimary} />
          <Text style={{ marginTop: 12, color: theme.textSecondary, fontSize: 14 }}>
            Synchronizing clinical roster...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item, index) => item.patientId || index.toString()}
          renderItem={renderPatientCard}
          contentContainerStyle={styles.scroll}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <User size={40} color={theme.textTertiary} style={{ marginBottom: 12 }} />
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
                No Patients Found
              </Text>
              <Text
                style={{
                  color: theme.textSecondary,
                  fontSize: 13,
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                Patients with scheduled or completed consultations will appear here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerSub: { fontSize: 11 },
  searchSection: { padding: Spacing.four, borderBottomWidth: 1 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    height: 44,
    paddingHorizontal: 12,
    marginBottom: Spacing.three,
    borderWidth: 1,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  filterText: { fontSize: 12, fontWeight: '600' },
  scroll: { padding: Spacing.four, paddingBottom: 60 },
  patientCard: {
    borderRadius: Radius.lg,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  patientName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  patientSub: { fontSize: 12 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  cardMiddle: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginBottom: 10,
  },
  middleCol: { flex: 1 },
  divider: { width: 1, marginHorizontal: 12 },
  middleLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  middleVal: { fontSize: 13, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 12 },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  actionText: { fontSize: 12, fontWeight: '700' },
});
