import { router } from 'expo-router';
import { ArrowLeft, CheckCircle, Clock, Lightbulb, Moon, Sun } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Palette, Radius, Spacing } from '../../../constants/theme';
import { useAuth } from '../../../context/useAuth';

export default function SleepTracker() {
  const { authenticatedFetch } = useAuth();
  const [saving, setSaving] = useState(false);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const accentColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;

  const handleSaveEntry = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await authenticatedFetch('/api/patients/wearable-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data_type: 'sleep',
          measurement_value: 7.5,
          unit: 'hours',
          notes: 'Bedtime 11:15 PM - Wake 06:45 AM',
        }),
      });
      await authenticatedFetch('/api/tracker/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          sleep_hours: 7.5,
          mood_rating: 8,
          mood_type: 'rested',
          journal_entry: 'Tracked 7.5h sleep via mobile',
        }),
      });
      Alert.alert('Logged', 'Sleep duration recorded in wellness chart.');
    } catch (e) {
      console.error(e);
      Alert.alert('Notice', 'Unable to record sleep entry.');
    } finally {
      setSaving(false);
    }
  };

  // Sleep cycle hypnogram distribution
  const sleepCycles = [
    { h: 30, type: 'awake' },
    { h: 60, type: 'light' },
    { h: 85, type: 'deep' },
    { h: 90, type: 'deep' },
    { h: 75, type: 'deep' },
    { h: 50, type: 'light' },
    { h: 55, type: 'light' },
    { h: 80, type: 'deep' },
    { h: 85, type: 'deep' },
    { h: 60, type: 'light' },
    { h: 40, type: 'awake' },
    { h: 70, type: 'light' },
    { h: 90, type: 'deep' },
    { h: 95, type: 'deep' },
    { h: 65, type: 'light' },
    { h: 55, type: 'light' },
    { h: 80, type: 'deep' },
    { h: 70, type: 'light' },
    { h: 60, type: 'light' },
    { h: 50, type: 'light' },
    { h: 40, type: 'awake' },
    { h: 65, type: 'light' },
    { h: 45, type: 'light' },
    { h: 25, type: 'awake' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Sleep & Recovery</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Circadian rest tracking. Last night you achieved{' '}
            <Text style={{ fontWeight: '700', color: accentColor }}>86%</Text> of your restorative
            rest goal.
          </Text>
        </View>

        {/* Hero Sleep Summary */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: isDark ? Palette.surfaceDark1 : Palette.sagePrimary },
          ]}
        >
          <View style={styles.heroBgIcon}>
            <Moon size={120} color="rgba(255,255,255,0.06)" />
          </View>
          <Text style={styles.heroLabel}>LAST NIGHT REST DURATION</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
            <Text style={styles.heroValue}>7h 42m</Text>
            <Text style={styles.heroUnit}>Optimal Window</Text>
          </View>

          <View style={styles.heroStatsGrid}>
            <View>
              <Text style={styles.statLabel}>Efficiency</Text>
              <Text style={styles.statValue}>94%</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Deep Sleep</Text>
              <Text style={styles.statValue}>1h 52m</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>REM Phase</Text>
              <Text style={styles.statValue}>2h 10m</Text>
            </View>
          </View>
        </View>

        {/* Log Sleep Card */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
              ]}
            >
              <Clock size={20} color={accentColor} />
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Record Sleep Window</Text>
          </View>

          <View style={{ gap: 12, marginBottom: 20 }}>
            <View>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Bedtime</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.inputText, { color: theme.text }]}>11:15 PM</Text>
                <Moon size={18} color={theme.textTertiary} />
              </View>
            </View>
            <View>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Wake Time</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.inputText, { color: theme.text }]}>06:45 AM</Text>
                <Sun size={18} color={theme.textTertiary} />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: Palette.sagePrimary }]}
            onPress={handleSaveEntry}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <CheckCircle size={18} color="#FFF" />
                <Text style={styles.btnPrimaryText}>Record Sleep Data</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Cycle Chart Card */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Sleep Stage Hypnogram</Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
              Cycle analysis for overnight restorative phases
            </Text>
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: accentColor }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>Deep Sleep</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: isDark ? Palette.sageDark : '#52B788' },
                ]}
              />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>Light / REM</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: isDark ? Palette.surfaceDark3 : Palette.surfaceWarm3 },
                ]}
              />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>Awake</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            {sleepCycles.map((bar, i) => (
              <View
                key={i}
                style={[
                  styles.bar,
                  {
                    height: `${bar.h}%`,
                    backgroundColor:
                      bar.type === 'deep'
                        ? accentColor
                        : bar.type === 'light'
                          ? isDark
                            ? '#40916C'
                            : '#74C69D'
                          : isDark
                            ? Palette.surfaceDark3
                            : Palette.surfaceWarm3,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.xAxis}>
            <Text style={[styles.xLabel, { color: theme.textTertiary }]}>11 PM</Text>
            <Text style={[styles.xLabel, { color: theme.textTertiary }]}>1 AM</Text>
            <Text style={[styles.xLabel, { color: theme.textTertiary }]}>3 AM</Text>
            <Text style={[styles.xLabel, { color: theme.textTertiary }]}>5 AM</Text>
            <Text style={[styles.xLabel, { color: theme.textTertiary }]}>7 AM</Text>
          </View>
        </View>

        {/* Wellness Insight Card */}
        <View
          style={[
            styles.insightCard,
            { backgroundColor: isDark ? 'rgba(224, 159, 62, 0.12)' : Palette.warningSubtle },
          ]}
        >
          <View style={styles.insightIconBox}>
            <Lightbulb size={24} color={Palette.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.insightTitle, { color: isDark ? '#FCD34D' : '#854D0E' }]}>
              Circadian Insight
            </Text>
            <Text
              style={[styles.insightText, { color: isDark ? Palette.textDarkPrimary : '#713F12' }]}
            >
              Based on your REM cycles, peak mental focus is projected between 10:00 AM and 1:30 PM
              today.
            </Text>
          </View>
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
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { padding: Spacing.four, paddingBottom: 60 },
  sectionHeader: { marginBottom: Spacing.four },
  subtitle: { fontSize: 14, lineHeight: 20 },
  heroCard: {
    padding: Spacing.five,
    borderRadius: Radius.lg,
    marginBottom: Spacing.four,
    overflow: 'hidden',
  },
  heroBgIcon: { position: 'absolute', bottom: -20, right: -20 },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  heroValue: { fontSize: 40, fontWeight: '800', color: '#FFFFFF' },
  heroUnit: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  heroStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: Spacing.three,
  },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  statValue: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
  card: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSubtitle: { fontSize: 12, marginTop: 2 },
  inputLabel: { fontSize: 12, marginBottom: 4, fontWeight: '600' },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  inputText: { fontSize: 15, fontWeight: '600' },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: Radius.md,
  },
  btnPrimaryText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  legendContainer: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, fontWeight: '500' },
  chartContainer: {
    height: 130,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 3,
  },
  bar: { flex: 1, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  xAxis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  xLabel: { fontSize: 10, fontWeight: '500' },
  insightCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
  },
  insightIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  insightText: { fontSize: 13, lineHeight: 18 },
});
