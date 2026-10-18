import { router, useLocalSearchParams } from 'expo-router';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Heart,
  History,
  Mic,
  PhoneOff,
  Pill,
  Settings,
  Video,
  Wind,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Palette, Radius, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/useAuth';

export default function ConsultationWorkspace() {
  const { authenticatedFetch } = useAuth();
  const { patientId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('vitals');
  const [patient, setPatient] = useState<any>(null);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const accentColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;

  useEffect(() => {
    if (!patientId) {
      return;
    }
    const fetchPatient = async () => {
      try {
        const res = await authenticatedFetch(`/api/doctors/patients/${patientId}/history`);
        if (res.ok) {
          const data = await res.json();
          setPatient({
            name: data.profile.name || 'Patient',
            age: data.profile.dob
              ? new Date().getFullYear() - new Date(data.profile.dob).getFullYear()
              : '--',
            history: data.history.past_surgeries || [],
            medications: data.history.chronic_conditions || [],
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatient();
  }, [patientId, authenticatedFetch]);

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
            <Text style={[styles.headerTitle, { color: theme.text }]}>Clinical Workspace</Text>
            <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
              Ansaea Telehealth Engine
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Settings size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Video Consultation Banner */}
        <View style={[styles.videoSection, { backgroundColor: Palette.surfaceDark1 }]}>
          <View style={styles.videoPlaceholder}>
            <Video size={40} color={Palette.textDarkTertiary} style={{ marginBottom: 8 }} />
            <Text style={{ color: Palette.textDarkSecondary, fontSize: 13 }}>
              Encrypted Clinical Video Stream
            </Text>
          </View>

          <View style={styles.videoOverlayTop}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE SESSION</Text>
            </View>
          </View>

          <View style={styles.videoControls}>
            <TouchableOpacity style={styles.controlBtn} activeOpacity={0.8}>
              <Mic size={18} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlBtn} activeOpacity={0.8}>
              <Video size={18} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: Palette.danger }]}
              activeOpacity={0.8}
              onPress={() => router.back()}
            >
              <PhoneOff size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Patient Identity Bar */}
        <View
          style={[
            styles.patientInfoBar,
            { backgroundColor: theme.surface, borderBottomColor: theme.border },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.patientName, { color: theme.text }]}>
              {patient?.name || 'Assigned Patient'}, {patient?.age || '--'} yrs
            </Text>
            <View style={styles.rowCenter}>
              <AlertTriangle size={13} color={Palette.warning} style={{ marginRight: 4 }} />
              <Text style={[styles.patientSub, { color: theme.textSecondary }]}>
                Chief Complaint: Chronic Pain Evaluation
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.sessionBadge,
              { backgroundColor: isDark ? 'rgba(64, 145, 108, 0.2)' : Palette.sageSubtle },
            ]}
          >
            <Text style={[styles.sessionText, { color: accentColor }]}>In Consultation</Text>
          </View>
        </View>

        {/* Workspace Tab Bar */}
        <View
          style={[
            styles.tabBar,
            { borderBottomColor: theme.border, backgroundColor: theme.surface },
          ]}
        >
          {[
            { id: 'vitals', label: 'Telemetry Vitals' },
            { id: 'history', label: 'Patient Chart' },
            { id: 'notes', label: 'SOAP Notes' },
          ].map((t) => {
            const isSel = activeTab === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.tab, isSel && { borderBottomColor: accentColor }]}
                onPress={() => setActiveTab(t.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: isSel ? accentColor : theme.textSecondary },
                    isSel && { fontWeight: '700' },
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'vitals' && (
            <View>
              <View style={styles.vitalsGrid}>
                <View
                  style={[
                    styles.vitalCard,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <Heart size={18} color={Palette.danger} />
                    <Text style={[styles.vitalLabel, { color: theme.textSecondary }]}>
                      PULSE RATE
                    </Text>
                  </View>
                  <View style={styles.vitalValRow}>
                    <Text style={[styles.vitalVal, { color: theme.text }]}>78</Text>
                    <Text style={[styles.vitalSub, { color: Palette.success }]}>Normal</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.vitalCard,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <Activity size={18} color={accentColor} />
                    <Text style={[styles.vitalLabel, { color: theme.textSecondary }]}>
                      BLOOD PRESSURE
                    </Text>
                  </View>
                  <View style={styles.vitalValRow}>
                    <Text style={[styles.vitalVal, { color: theme.text }]}>118/76</Text>
                  </View>
                  <View style={styles.rowCenter}>
                    <View style={[styles.dot, { backgroundColor: Palette.success }]} />
                    <Text style={[styles.vitalSub, { color: Palette.success }]}>Normotensive</Text>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.vitalRowCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <View style={styles.rowBetween}>
                  <View style={styles.rowCenter}>
                    <Wind size={18} color={accentColor} style={{ marginRight: 8 }} />
                    <Text style={[styles.vitalLabelBig, { color: theme.text }]}>
                      SpO2 Blood Oxygen Saturation
                    </Text>
                  </View>
                  <Text style={[styles.vitalValBig, { color: theme.text }]}>99%</Text>
                </View>
                <View
                  style={[
                    styles.barBg,
                    { backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2 },
                  ]}
                >
                  <View style={[styles.barFill, { width: '99%', backgroundColor: accentColor }]} />
                </View>
              </View>
            </View>
          )}

          {activeTab === 'history' && (
            <View>
              <View
                style={[
                  styles.historyCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.historyTitle, { color: accentColor }]}>
                  Past Diagnoses & Surgeries
                </Text>

                {!patient?.history || patient.history.length === 0 ? (
                  <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                    No major surgeries recorded in chart.
                  </Text>
                ) : (
                  patient.history.map((item: any, idx: number) => (
                    <View
                      key={idx}
                      style={[styles.historyItem, { borderBottomColor: theme.border }]}
                    >
                      <View
                        style={[
                          styles.historyIconBox,
                          { backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2 },
                        ]}
                      >
                        <History size={16} color={theme.textSecondary} />
                      </View>
                      <View>
                        <Text style={[styles.historyDate, { color: theme.text }]}>
                          {typeof item === 'string' ? item : item.name || 'Procedure'}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>

              <View
                style={[
                  styles.historyCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.historyTitle, { color: accentColor }]}>
                  Allergies on Record
                </Text>
                <View style={styles.tagsRow}>
                  <View
                    style={[
                      styles.tagRed,
                      {
                        backgroundColor: isDark ? 'rgba(193, 41, 46, 0.15)' : Palette.dangerSubtle,
                      },
                    ]}
                  >
                    <Text style={[styles.tagRedText, { color: Palette.danger }]}>
                      Penicillin (Severe)
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.tagGray,
                      { backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2 },
                    ]}
                  >
                    <Text style={[styles.tagGrayText, { color: theme.textSecondary }]}>
                      Latex (Mild)
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'notes' && (
            <View>
              <View
                style={[
                  styles.notesCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <View
                  style={[
                    styles.notesHeader,
                    { backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2 },
                  ]}
                >
                  <Text style={[styles.notesTitle, { color: theme.textSecondary }]}>
                    AI Real-Time Ambient Transcription
                  </Text>
                  <View style={[styles.liveDot, { backgroundColor: Palette.success }]} />
                </View>
                <View style={styles.notesBody}>
                  <Text style={[styles.notesText, { color: theme.text }]}>
                    "Patient reports chronic lumbar pain exacerbated by seated desk work, with
                    gradual relief upon supine decompression. No radiation to extremities noted..."
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: Spacing.two }}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: Palette.sagePrimary }]}
                  onPress={() =>
                    router.push({
                      pathname: '/clinical_notes' as any,
                      params: { appointmentId: 'demo-appt' },
                    })
                  }
                  activeOpacity={0.85}
                >
                  <FileText size={16} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnText}>Full SOAP Editor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2,
                      borderWidth: 1,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: '/eprescription' as any,
                      params: { appointmentId: 'demo-appt', patientId },
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Pill size={16} color={accentColor} style={{ marginRight: 6 }} />
                  <Text style={[styles.actionBtnText, { color: theme.text }]}>E-Prescription</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
  iconBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 60 },
  videoSection: { height: 210, position: 'relative' },
  videoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  videoOverlayTop: { position: 'absolute', top: 12, right: 12 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.danger,
    marginRight: 6,
  },
  liveText: { color: '#FFF', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  videoControls: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  controlBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientInfoBar: {
    padding: Spacing.four,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  patientName: { fontSize: 17, fontWeight: '700', marginBottom: 2 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  patientSub: { fontSize: 12 },
  sessionBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
  sessionText: { fontSize: 11, fontWeight: '700' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: { fontSize: 13, fontWeight: '600' },
  tabContent: { padding: Spacing.four },
  vitalsGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  vitalCard: { flex: 1, borderRadius: Radius.lg, padding: Spacing.four, borderWidth: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vitalLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  vitalValRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 10, marginBottom: 4 },
  vitalVal: { fontSize: 24, fontWeight: '800' },
  vitalSub: { fontSize: 11, fontWeight: '700', marginLeft: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  vitalRowCard: {
    borderRadius: Radius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: 10,
  },
  vitalLabelBig: { fontSize: 13, fontWeight: '600' },
  vitalValBig: { fontSize: 16, fontWeight: '700' },
  barBg: { height: 6, borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  historyCard: {
    borderRadius: Radius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  historyTitle: { fontSize: 14, fontWeight: '700', marginBottom: Spacing.three },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  historyIconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  historyDate: { fontSize: 13, fontWeight: '600' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagRed: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.sm },
  tagRedText: { fontSize: 12, fontWeight: '700' },
  tagGray: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.sm },
  tagGrayText: { fontSize: 12, fontWeight: '600' },
  notesCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.four,
  },
  notesHeader: {
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notesTitle: { fontSize: 12, fontWeight: '600' },
  notesBody: { padding: Spacing.four, minHeight: 90 },
  notesText: { fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Radius.md,
  },
  actionBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
});
