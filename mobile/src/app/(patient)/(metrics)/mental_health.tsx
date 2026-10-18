import { router } from 'expo-router';
import { ArrowLeft, Calendar, Edit3, Music, PlayCircle, Smile, Wind } from 'lucide-react-native';
import {
  Dimensions,
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

const { width } = Dimensions.get('window');

export default function MentalHealthDashboard() {
  const { user } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const accentColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.headerNav,
          { borderBottomColor: theme.border, backgroundColor: theme.surface },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerNavTitle, { color: theme.text }]}>Mind & Mindfulness</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Welcome Section */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Good morning, {user?.username || 'Patient'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Your mental sanctuary is ready. How are you feeling in this moment?
          </Text>
        </View>

        {/* Mood Summary Card */}
        <View
          style={[styles.moodCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <View style={styles.moodTop}>
            <View style={{ flex: 1, marginRight: Spacing.three }}>
              <View
                style={[
                  styles.moodBadge,
                  { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
                ]}
              >
                <Text style={[styles.moodBadgeText, { color: accentColor }]}>
                  WEEKLY MOOD BASELINE
                </Text>
              </View>
              <Text style={[styles.moodTitle, { color: theme.text }]}>Calm & Balanced</Text>
              <Text style={[styles.moodDesc, { color: theme.textSecondary }]}>
                Your emotional resilience has improved by 14% this week. You have consistently
                engaged in grounding exercises.
              </Text>
            </View>
            <View
              style={[
                styles.moodIconBox,
                { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
              ]}
            >
              <Smile size={28} color={accentColor} />
            </View>
          </View>

          <View style={styles.chartContainer}>
            {[40, 60, 55, 85, 70, 75, 65].map((h, i) => (
              <View
                key={i}
                style={[
                  styles.bar,
                  {
                    height: `${h}%`,
                    backgroundColor:
                      h === 85
                        ? accentColor
                        : isDark
                          ? 'rgba(45, 106, 79, 0.3)'
                          : Palette.sageSubtle,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Daily Focus Card */}
        <View
          style={[
            styles.focusCard,
            { backgroundColor: isDark ? Palette.surfaceDark1 : Palette.sagePrimary },
          ]}
        >
          <Text style={styles.focusTitle}>Daily Somatic Focus</Text>
          <Text style={styles.focusDesc}>
            Box Breathing: 4 seconds inhale, 4 seconds hold, 4 seconds exhale.
          </Text>

          <View style={styles.focusCircleContainer}>
            <View style={styles.focusCircleOuter}>
              <View style={styles.focusCircleInner}>
                <Wind size={36} color="#FFF" />
              </View>
            </View>
            <TouchableOpacity
              style={styles.btnStartSession}
              onPress={() => router.push('/(patient)/(metrics)/breathing_exercise' as any)}
              activeOpacity={0.88}
            >
              <Text style={[styles.btnStartSessionText, { color: Palette.sagePrimary }]}>
                Begin Guided Breathing
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.gridItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/(patient)/(metrics)/cbt_diary' as any)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.gridIconBox,
                { backgroundColor: isDark ? 'rgba(69, 123, 157, 0.2)' : Palette.infoSubtle },
              ]}
            >
              <Edit3 size={22} color={Palette.info} />
            </View>
            <Text style={[styles.gridItemText, { color: theme.text }]}>CBT Reframer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(patient)/(metrics)/mood_check_in' as any)}
            style={[styles.gridItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.gridIconBox,
                { backgroundColor: isDark ? 'rgba(64, 145, 108, 0.2)' : Palette.sageSubtle },
              ]}
            >
              <Smile size={22} color={Palette.success} />
            </View>
            <Text style={[styles.gridItemText, { color: theme.text }]}>Mood Check-in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/(patient)/(metrics)/breathing_exercise' as any)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.gridIconBox,
                { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
              ]}
            >
              <Wind size={22} color={accentColor} />
            </View>
            <Text style={[styles.gridItemText, { color: theme.text }]}>Breathwork</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/(patient)/(metrics)/self_care' as any)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.gridIconBox,
                { backgroundColor: isDark ? 'rgba(224, 159, 62, 0.15)' : Palette.warningSubtle },
              ]}
            >
              <Calendar size={22} color={Palette.warning} />
            </View>
            <Text style={[styles.gridItemText, { color: theme.text }]}>Self-Care Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Tracks */}
        <View
          style={[
            styles.recommendedCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={[styles.recTitle, { color: theme.text }]}>Restorative Soundscapes</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.recLink, { color: accentColor }]}>Explore Library</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={[
                styles.trackItem,
                {
                  backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                  borderColor: theme.border,
                },
              ]}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.trackIconBox,
                  { backgroundColor: isDark ? 'rgba(69, 123, 157, 0.2)' : Palette.infoSubtle },
                ]}
              >
                <Music size={20} color={Palette.info} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.trackName, { color: theme.text }]}>Temperate Forest Rain</Text>
                <Text style={[styles.trackDesc, { color: theme.textSecondary }]}>
                  15 min • Delta waves for deep sleep
                </Text>
              </View>
              <PlayCircle size={22} color={accentColor} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.trackItem,
                {
                  backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                  borderColor: theme.border,
                },
              ]}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.trackIconBox,
                  { backgroundColor: isDark ? 'rgba(64, 145, 108, 0.2)' : Palette.sageSubtle },
                ]}
              >
                <Music size={20} color={Palette.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.trackName, { color: theme.text }]}>
                  Zen Acoustic Resonance
                </Text>
                <Text style={[styles.trackDesc, { color: theme.textSecondary }]}>
                  10 min • Cognitive clarity & grounding
                </Text>
              </View>
              <PlayCircle size={22} color={accentColor} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerNavTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { padding: Spacing.four, paddingBottom: 60 },
  header: { marginBottom: Spacing.four },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, lineHeight: 20 },
  moodCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  moodTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.four,
  },
  moodBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: 8,
  },
  moodBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  moodTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  moodDesc: { fontSize: 13, lineHeight: 18 },
  moodIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 75,
    gap: 4,
  },
  bar: { flex: 1, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  focusCard: { padding: Spacing.five, borderRadius: Radius.lg, marginBottom: Spacing.four },
  focusTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 6 },
  focusDesc: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: Spacing.four },
  focusCircleContainer: { alignItems: 'center', marginVertical: 8 },
  focusCircleOuter: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusCircleInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnStartSession: {
    backgroundColor: '#FFF',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: Radius.full,
    marginTop: Spacing.four,
  },
  btnStartSessionText: { fontSize: 13, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, marginBottom: Spacing.four },
  gridItem: {
    width: (width - 40) / 2,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: 10,
  },
  gridIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridItemText: { fontSize: 13, fontWeight: '600' },
  recommendedCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  recTitle: { fontSize: 16, fontWeight: '700' },
  recLink: { fontSize: 13, fontWeight: '600' },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  trackIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  trackDesc: { fontSize: 12 },
});
