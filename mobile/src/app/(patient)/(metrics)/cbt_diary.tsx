import { router } from 'expo-router';
import { ArrowLeft, Brain, CheckCircle2, Plus, Sparkles, Trash2, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Colors, Palette, Radius, Spacing } from '../../../constants/theme';
import { useAuth } from '../../../context/useAuth';

export default function CBTDiary() {
  const { authenticatedFetch } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [situation, setSituation] = useState('');
  const [thought, setThought] = useState('');
  const [distortion, setDistortion] = useState('Catastrophizing');
  const [reframed, setReframed] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const accentColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;

  const distortions = [
    'Catastrophizing',
    'All-or-Nothing',
    'Mind Reading',
    'Emotional Reasoning',
    'Overgeneralization',
    'Mental Filter',
  ];

  const fetchLogs = async () => {
    try {
      const res = await authenticatedFetch('/api/tracker/cbt');
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [authenticatedFetch]);

  const handleSubmit = async () => {
    if (!situation || !thought || !reframed) {
      Alert.alert(
        'Incomplete Entry',
        'Please fill in the situation, negative thought, and rational reframe.',
      );
      return;
    }
    setSubmitting(true);
    try {
      const res = await authenticatedFetch('/api/tracker/cbt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: situation,
          negative_thoughts: thought,
          distortions: distortion ? [distortion] : ['General'],
          rational_thoughts: reframed,
          date: new Date().toISOString().split('T')[0],
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setSituation('');
        setThought('');
        setReframed('');
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await authenticatedFetch(`/api/tracker/cbt/${id}`, { method: 'DELETE' });
      if (res.ok) fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>CBT Thought Reframer</Text>
        <TouchableOpacity
          onPress={() => setShowModal(!showModal)}
          style={[styles.addBtn, { backgroundColor: Palette.sagePrimary }]}
          activeOpacity={0.85}
        >
          {showModal ? <X size={20} color="#fff" /> : <Plus size={20} color="#fff" />}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {showModal && (
            <View
              style={[
                styles.modalCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}
              >
                <Sparkles size={18} color={accentColor} />
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Reflect & Cognitive Challenge
                </Text>
              </View>

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                1. Activating Trigger Situation
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="What event or interaction triggered your distress?"
                placeholderTextColor={theme.textTertiary}
                value={situation}
                onChangeText={setSituation}
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                2. Automatic Negative Thought
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="What automatic thought entered your mind?"
                placeholderTextColor={theme.textTertiary}
                value={thought}
                onChangeText={setThought}
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                3. Cognitive Distortion Category
              </Text>
              <View style={styles.distortionGrid}>
                {distortions.map((d) => {
                  const isSel = distortion === d;
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[
                        styles.distChip,
                        {
                          backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                          borderColor: theme.border,
                        },
                        isSel && {
                          backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle,
                          borderColor: accentColor,
                        },
                      ]}
                      onPress={() => setDistortion(d)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.distText,
                          { color: theme.textSecondary },
                          isSel && { color: accentColor, fontWeight: '700' },
                        ]}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                4. Rational Alternative / Reframe
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    height: 75,
                    backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                multiline
                placeholder="What is an objective, balanced evidence-based perspective?"
                placeholderTextColor={theme.textTertiary}
                value={reframed}
                onChangeText={setReframed}
              />

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: Palette.sagePrimary }]}
                onPress={handleSubmit}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>
                  {submitting ? 'Recording Insight...' : 'Save Reframed Entry'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Reframing Logs ({logs.length})
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={Palette.sagePrimary} style={{ marginTop: 24 }} />
          ) : logs.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Brain size={44} color={theme.textTertiary} style={{ marginBottom: 12 }} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No Cognitive Diary Logs
              </Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                Tap the + button above to challenge an unhelpful cognitive distortion with rational
                reframing.
              </Text>
            </View>
          ) : (
            logs.map((log) => {
              const distortionLabel =
                Array.isArray(log.distortions) && log.distortions.length > 0
                  ? log.distortions.join(', ')
                  : log.distortions || log.cognitive_distortion || 'General Distortion';
              const thoughtText =
                log.negative_thoughts || log.automatic_thought || 'Negative thought';
              const rationalText =
                log.rational_thoughts || log.rational_response || 'Reframed rational perspective';
              const situationText = log.situation || log.trigger_situation || 'General context';

              return (
                <View
                  key={log.id}
                  style={[
                    styles.logCard,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  <View style={styles.logHeader}>
                    <View
                      style={[
                        styles.distortionBadge,
                        {
                          backgroundColor: isDark
                            ? 'rgba(224, 159, 62, 0.15)'
                            : Palette.warningSubtle,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.distortionBadgeText,
                          { color: isDark ? '#FCD34D' : '#854D0E' },
                        ]}
                      >
                        {distortionLabel}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDelete(log.id)} activeOpacity={0.7}>
                      <Trash2 size={16} color={Palette.danger} />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.logThought, { color: theme.text }]}>"{thoughtText}"</Text>

                  <View
                    style={[
                      styles.reframeBox,
                      { backgroundColor: isDark ? 'rgba(64, 145, 108, 0.15)' : Palette.sageSubtle },
                    ]}
                  >
                    <CheckCircle2 size={16} color={Palette.success} style={{ marginTop: 2 }} />
                    <Text
                      style={[
                        styles.reframeText,
                        { color: isDark ? Palette.textDarkPrimary : Palette.sageDark },
                      ]}
                    >
                      {rationalText}
                    </Text>
                  </View>

                  <Text style={[styles.logContext, { color: theme.textTertiary }]}>
                    Context: {situationText}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: Spacing.four, paddingBottom: 60 },
  modalCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  modalTitle: { fontSize: 16, fontWeight: '700' },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
    marginTop: Spacing.two,
    letterSpacing: 0.5,
  },
  input: { borderRadius: Radius.md, padding: 12, borderWidth: 1, fontSize: 14 },
  distortionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 6 },
  distChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.sm, borderWidth: 1 },
  distText: { fontSize: 11, fontWeight: '600' },
  submitBtn: {
    padding: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.three },
  logCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  distortionBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
  distortionBadgeText: { fontSize: 11, fontWeight: '700' },
  logThought: { fontSize: 15, fontWeight: '600', fontStyle: 'italic', marginBottom: 8 },
  reframeBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: Radius.md,
    marginBottom: 8,
  },
  reframeText: { fontSize: 13, flex: 1, fontWeight: '500', lineHeight: 18 },
  logContext: { fontSize: 12 },
  emptyCard: {
    padding: Spacing.eight,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
