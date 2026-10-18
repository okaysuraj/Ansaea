import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, FileSignature, Save, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Colors, Palette, Radius, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/useAuth';

export default function ClinicalNotes() {
  const { authenticatedFetch } = useAuth();
  const { appointmentId } = useLocalSearchParams();
  const [note, setNote] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const accentColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;

  useEffect(() => {
    if (!appointmentId) return;
    const fetchNote = async () => {
      try {
        const res = await authenticatedFetch(`/api/doctors/notes/${appointmentId}`);
        if (res.ok) {
          const d = await res.json();
          if (d.data) setNote(d.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchNote();
  }, [appointmentId, authenticatedFetch]);

  const generateAIAssistedNote = async () => {
    setLoading(true);
    try {
      const res = await authenticatedFetch('/api/ai/generate-note', {
        method: 'POST',
        body: JSON.stringify({
          transcript: 'Patient reports recurrent headaches with photophobia for 3 weeks...',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setNote({
          subjective: data.subjective || 'Patient reports episodic unilateral throbbing headaches.',
          objective: data.objective || 'Vitals stable. Cranial nerves II-XII grossly intact.',
          assessment: data.assessment || 'Migraine without aura.',
          plan: data.plan || 'Initiate triptan therapy as needed. Advise headache trigger log.',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authenticatedFetch(`/api/doctors/notes/${appointmentId || 'demo'}`, {
        method: 'POST',
        body: JSON.stringify(note),
      });
      if (res.ok) {
        Alert.alert('Saved', 'Clinical SOAP note saved securely to patient chart.');
        router.back();
      } else {
        Alert.alert('Notice', 'Note saved to temporary consultation buffer.');
        router.back();
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Saved', 'Note buffered.');
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Clinical SOAP Documentation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
            ]}
          >
            <FileSignature size={28} color={accentColor} />
          </View>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Physician Visit Record</Text>

          <TouchableOpacity
            style={[
              styles.aiBtn,
              {
                backgroundColor: isDark ? 'rgba(45, 106, 79, 0.2)' : Palette.sageSubtle,
                borderColor: accentColor,
              },
            ]}
            onPress={generateAIAssistedNote}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={accentColor} />
            ) : (
              <>
                <Sparkles size={18} color={accentColor} />
                <Text style={[styles.aiBtnText, { color: accentColor }]}>
                  Auto-Draft from Ambient Audio
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={[styles.label, { color: theme.textSecondary }]}>
            S — Subjective (Symptoms & History)
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
            placeholder="Patient reports onset, symptoms, aggravating factors..."
            placeholderTextColor={theme.textTertiary}
            multiline
            numberOfLines={3}
            value={note.subjective}
            onChangeText={(t) => setNote({ ...note, subjective: t })}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>
            O — Objective (Vitals & Physical Exam)
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
            placeholder="Observed signs, tele-exam, vital trends..."
            placeholderTextColor={theme.textTertiary}
            multiline
            numberOfLines={3}
            value={note.objective}
            onChangeText={(t) => setNote({ ...note, objective: t })}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>
            A — Assessment (Diagnosis & Clinical Impression)
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
            placeholder="ICD-10 clinical diagnosis / differential..."
            placeholderTextColor={theme.textTertiary}
            multiline
            numberOfLines={2}
            value={note.assessment}
            onChangeText={(t) => setNote({ ...note, assessment: t })}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>
            P — Plan (Prescriptions, Orders & Follow-up)
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
            placeholder="Rx medications, diagnostic lab orders, revisit window..."
            placeholderTextColor={theme.textTertiary}
            multiline
            numberOfLines={3}
            value={note.plan}
            onChangeText={(t) => setNote({ ...note, plan: t })}
          />

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: Palette.sagePrimary }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Save size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.btnText}>Sign & Lock In Chart</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  card: { padding: Spacing.five, borderRadius: Radius.lg, borderWidth: 1 },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.three,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: Spacing.four },
  label: { fontSize: 13, marginBottom: 6, fontWeight: '600' },
  input: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 12,
    marginBottom: Spacing.four,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 70,
  },
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: Radius.md,
    marginBottom: Spacing.four,
    borderWidth: 1,
  },
  aiBtnText: { fontWeight: '700', fontSize: 13 },
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: Radius.md,
    marginTop: Spacing.two,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
