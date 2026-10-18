import { router } from 'expo-router';
import { ArrowLeft, Check, HeartPulse } from 'lucide-react-native';
import { useState } from 'react';
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
import { Colors, Palette, Radius, Spacing } from '../../../constants/theme';
import { useAuth } from '../../../context/useAuth';

export default function VitalsTracker() {
  const { authenticatedFetch } = useAuth();
  const [vitals, setVitals] = useState({
    blood_pressure: '',
    heart_rate: '',
    spo2: '',
    temperature: '',
    bmi: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const accentColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;

  const handleSave = async () => {
    setLoading(true);
    setSuccess('');
    try {
      const payload = {
        ...vitals,
        heart_rate: vitals.heart_rate ? parseInt(vitals.heart_rate) : null,
        spo2: vitals.spo2 ? parseInt(vitals.spo2) : null,
        temperature: vitals.temperature ? parseFloat(vitals.temperature) : null,
        bmi: vitals.bmi ? parseFloat(vitals.bmi) : null,
      };

      const res = await authenticatedFetch('/api/tracker/vitals', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess('Clinical vitals recorded in chart!');
        setVitals({ blood_pressure: '', heart_rate: '', spo2: '', temperature: '', bmi: '' });
      } else {
        Alert.alert('Notice', 'Could not record vitals.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setLoading(false);
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Clinical Vitals</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
            ]}
          >
            <HeartPulse size={28} color={accentColor} />
          </View>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Log Daily Telehealth Vitals</Text>

          {success ? (
            <View
              style={[
                styles.successBox,
                { backgroundColor: isDark ? 'rgba(64, 145, 108, 0.2)' : Palette.sageSubtle },
              ]}
            >
              <Check size={16} color={Palette.success} style={{ marginRight: 6 }} />
              <Text style={[styles.successText, { color: Palette.success }]}>{success}</Text>
            </View>
          ) : null}

          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Blood Pressure (Systolic / Diastolic)
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
            placeholder="e.g. 120/80 mmHg"
            placeholderTextColor={theme.textTertiary}
            value={vitals.blood_pressure}
            onChangeText={(t) => setVitals({ ...vitals, blood_pressure: t })}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Resting Heart Rate (BPM)
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
            placeholder="e.g. 72 bpm"
            placeholderTextColor={theme.textTertiary}
            keyboardType="numeric"
            value={vitals.heart_rate}
            onChangeText={(t) => setVitals({ ...vitals, heart_rate: t })}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Blood Oxygen Saturation (SpO2 %)
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
            placeholder="e.g. 98 %"
            placeholderTextColor={theme.textTertiary}
            keyboardType="numeric"
            value={vitals.spo2}
            onChangeText={(t) => setVitals({ ...vitals, spo2: t })}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Core Body Temperature (°F)
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
            placeholder="e.g. 98.6 °F"
            placeholderTextColor={theme.textTertiary}
            keyboardType="numeric"
            value={vitals.temperature}
            onChangeText={(t) => setVitals({ ...vitals, temperature: t })}
          />

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: Palette.sagePrimary }]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Record in Health Chart</Text>
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
    width: 52,
    height: 52,
    borderRadius: 26,
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
    fontSize: 15,
  },
  btn: { padding: 15, borderRadius: Radius.md, alignItems: 'center', marginTop: Spacing.two },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: Radius.md,
    marginBottom: Spacing.four,
  },
  successText: { fontWeight: '700', fontSize: 13 },
});
