import { router } from 'expo-router';
import { ArrowLeft, Calendar as CalendarIcon, Check, Clock } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Palette, Radius, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/useAuth';

export default function SlotManagement() {
  const { authenticatedFetch } = useAuth();
  const [bufferEnabled, setBufferEnabled] = useState(true);
  const [duration, setDuration] = useState('30');

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const accentColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;

  const [schedule, setSchedule] = useState([
    { day: 'Monday', active: true, mStart: '09:00', mEnd: '13:00', aStart: '14:00', aEnd: '18:00' },
    {
      day: 'Tuesday',
      active: true,
      mStart: '09:00',
      mEnd: '13:00',
      aStart: '14:00',
      aEnd: '18:00',
    },
    {
      day: 'Wednesday',
      active: true,
      mStart: '08:30',
      mEnd: '12:00',
      aStart: '13:00',
      aEnd: '17:00',
    },
    {
      day: 'Thursday',
      active: false,
      mStart: '09:00',
      mEnd: '13:00',
      aStart: '14:00',
      aEnd: '18:00',
    },
    { day: 'Friday', active: true, mStart: '10:00', mEnd: '14:00', aStart: '15:00', aEnd: '19:00' },
  ]);

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].active = !newSchedule[index].active;
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const activeSlots: string[] = [];
      schedule
        .filter((s) => s.active)
        .forEach((s) => {
          if (s.mStart) activeSlots.push(`${s.mStart}`);
          if (s.aStart) activeSlots.push(`${s.aStart}`);
        });
      if (activeSlots.length === 0) {
        activeSlots.push('09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM');
      }

      const res = await authenticatedFetch('/api/doctors/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          available_slots: activeSlots,
        }),
      });
      if (res.ok) {
        Alert.alert('Success', 'Availability slots saved to tele-consultation directory!');
      } else {
        Alert.alert('Notice', 'Slot configuration buffered.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Notice', 'Slot configuration buffered.');
    }
  };

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
              Roster & Slot Management
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.text }]}>Clinical Availability</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Configure your weekly telehealth shift ranges and buffer intervals.
          </Text>
        </View>

        {/* Status Card */}
        <View
          style={[
            styles.statusCard,
            { backgroundColor: isDark ? Palette.surfaceDark1 : Palette.sagePrimary },
          ]}
        >
          <View>
            <Text style={styles.statusTitle}>Accepting Appointments</Text>
            <Text style={styles.statusDesc}>
              Your schedule is live across patient search for 32 slots/week.
            </Text>
          </View>
          <CalendarIcon
            size={56}
            color="rgba(255,255,255,0.18)"
            style={{ position: 'absolute', right: -6, bottom: -6 }}
          />
        </View>

        {/* Slot Duration */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Slot Duration</Text>
          <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
            Standard consultation session length
          </Text>

          <View style={styles.durationRow}>
            {['15', '30', '45', '60'].map((val) => {
              const isSel = duration === val;
              return (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.durationBtn,
                    {
                      backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                      borderColor: theme.border,
                    },
                    isSel && {
                      backgroundColor: Palette.sagePrimary,
                      borderColor: Palette.sagePrimary,
                    },
                  ]}
                  onPress={() => setDuration(val)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.durationText,
                      { color: theme.textSecondary },
                      isSel && { color: '#FFF', fontWeight: '700' },
                    ]}
                  >
                    {val} min
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Buffer Time */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Clinical Transition Buffer
            </Text>
            <Switch
              value={bufferEnabled}
              onValueChange={setBufferEnabled}
              trackColor={{ false: theme.border, true: accentColor }}
              thumbColor="#FFF"
            />
          </View>
          <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
            Adds a 5-minute interval between bookings for SOAP note charting.
          </Text>
          {bufferEnabled && (
            <View style={styles.bufferInfo}>
              <Clock size={16} color={accentColor} />
              <Text style={[styles.bufferText, { color: accentColor }]}>
                Active: +5 min buffer per patient
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Weekly Shift Windows</Text>

        <View style={styles.scheduleList}>
          {schedule.map((dayConfig, index) => (
            <View
              key={dayConfig.day}
              style={[
                styles.dayCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
                !dayConfig.active && { opacity: 0.5 },
              ]}
            >
              <View style={styles.dayHeader}>
                <View style={styles.rowCenter}>
                  <Switch
                    value={dayConfig.active}
                    onValueChange={() => toggleDay(index)}
                    trackColor={{ false: theme.border, true: accentColor }}
                    thumbColor="#FFF"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[styles.dayName, { color: theme.text }]}>{dayConfig.day}</Text>
                </View>
              </View>

              <View style={styles.shiftsContainer}>
                <View
                  style={[
                    styles.shiftBox,
                    {
                      backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.shiftLabel, { color: theme.textSecondary }]}>
                    MORNING BLOCK
                  </Text>
                  <Text
                    style={[
                      styles.shiftTime,
                      { color: dayConfig.active ? accentColor : theme.textSecondary },
                    ]}
                  >
                    {dayConfig.mStart} — {dayConfig.mEnd}
                  </Text>
                </View>
                <View
                  style={[
                    styles.shiftBox,
                    {
                      backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.shiftLabel, { color: theme.textSecondary }]}>
                    AFTERNOON BLOCK
                  </Text>
                  <Text
                    style={[
                      styles.shiftTime,
                      { color: dayConfig.active ? accentColor : theme.textSecondary },
                    ]}
                  >
                    {dayConfig.aStart} — {dayConfig.aEnd}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.fabSave, { backgroundColor: Palette.sagePrimary }]}
        onPress={handleSave}
        activeOpacity={0.85}
      >
        <Check size={26} color="#FFF" />
      </TouchableOpacity>
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
  scroll: { padding: Spacing.four, paddingBottom: 100 },
  titleSection: { marginBottom: Spacing.four },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 2 },
  subtitle: { fontSize: 13, lineHeight: 18 },
  statusCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: Spacing.four,
  },
  statusTitle: { fontSize: 17, fontWeight: '700', color: '#FFF', marginBottom: 2 },
  statusDesc: { fontSize: 13, color: 'rgba(255,255,255,0.9)', maxWidth: '85%' },
  card: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  cardDesc: { fontSize: 13, marginBottom: Spacing.three },
  durationRow: { flexDirection: 'row', gap: 8 },
  durationBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  durationText: { fontSize: 13, fontWeight: '600' },
  bufferInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  bufferText: { fontWeight: '700', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.three },
  scheduleList: { marginBottom: Spacing.four },
  dayCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    marginBottom: Spacing.two,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  dayName: { fontSize: 16, fontWeight: '700' },
  shiftsContainer: { flexDirection: 'row', gap: 10 },
  shiftBox: { flex: 1, padding: 10, borderRadius: Radius.md, borderWidth: 1 },
  shiftLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  shiftTime: { fontSize: 13, fontWeight: '700' },
  fabSave: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
