import { router } from 'expo-router';
import {
  Activity,
  ArrowLeft,
  Bell,
  Calendar,
  Check,
  Mail,
  Megaphone,
  MessageSquare,
  Moon,
  Pill,
  Sun,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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

export default function NotificationSettings() {
  const { authenticatedFetch } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [toggles, setToggles] = useState({
    push_enabled: true,
    email_enabled: true,
    sms_enabled: false,
    appointment_alerts: true,
    medication_alerts: true,
    lab_alerts: true,
    marketing_alerts: false,
    dnd_enabled: false,
    dnd_start_time: '22:00',
    dnd_end_time: '07:00',
  });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await authenticatedFetch('/api/patients/notifications');
        if (res.ok) {
          const data = await res.json();
          setToggles({
            push_enabled: data.push_enabled ?? true,
            email_enabled: data.email_enabled ?? true,
            sms_enabled: data.sms_enabled ?? false,
            appointment_alerts: data.appointment_alerts ?? true,
            medication_alerts: data.medication_alerts ?? true,
            lab_alerts: data.lab_alerts ?? true,
            marketing_alerts: data.marketing_alerts ?? false,
            dnd_enabled: data.dnd_enabled ?? false,
            dnd_start_time: data.dnd_start_time ?? '22:00',
            dnd_end_time: data.dnd_end_time ?? '07:00',
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrefs();
  }, [authenticatedFetch]);

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authenticatedFetch('/api/patients/notifications', {
        method: 'PUT',
        body: JSON.stringify(toggles),
      });
      if (res.ok) {
        Alert.alert('Saved', 'Notification preferences updated successfully.');
        router.back();
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not save notification preferences.');
    } finally {
      setSaving(false);
    }
  };

  const accentColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notification Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Delivery Channels</Text>

          <View
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
              <View style={styles.settingInfo}>
                <View
                  style={[
                    styles.iconWrapper,
                    { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
                  ]}
                >
                  <Bell size={20} color={accentColor} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    Push Notifications
                  </Text>
                  <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                    Real-time clinical and appointment alerts
                  </Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: theme.border, true: accentColor }}
                thumbColor="#fff"
                onValueChange={() => toggleSwitch('push_enabled')}
                value={toggles.push_enabled}
              />
            </View>

            <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
              <View style={styles.settingInfo}>
                <View
                  style={[
                    styles.iconWrapper,
                    { backgroundColor: isDark ? 'rgba(69, 123, 157, 0.2)' : Palette.infoSubtle },
                  ]}
                >
                  <Mail size={20} color={Palette.info} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>Email Summaries</Text>
                  <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                    Detailed consultation transcripts & lab reports
                  </Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: theme.border, true: accentColor }}
                thumbColor="#fff"
                onValueChange={() => toggleSwitch('email_enabled')}
                value={toggles.email_enabled}
              />
            </View>

            <View style={[styles.settingItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <View style={styles.settingInfo}>
                <View
                  style={[
                    styles.iconWrapper,
                    { backgroundColor: isDark ? 'rgba(64, 145, 108, 0.2)' : Palette.sageSubtle },
                  ]}
                >
                  <MessageSquare size={20} color={Palette.success} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    SMS Urgent Alerts
                  </Text>
                  <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                    Critical prescription & emergency updates
                  </Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: theme.border, true: accentColor }}
                thumbColor="#fff"
                onValueChange={() => toggleSwitch('sms_enabled')}
                value={toggles.sms_enabled}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Alert Categories</Text>

            <View
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
                <View style={styles.settingInfo}>
                  <View
                    style={[
                      styles.iconWrapper,
                      { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
                    ]}
                  >
                    <Calendar size={20} color={accentColor} />
                  </View>
                  <View style={{ flex: 1, paddingRight: 16 }}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>
                      Appointment Reminders
                    </Text>
                    <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                      24-hour and 1-hour pre-session notices
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: theme.border, true: accentColor }}
                  thumbColor="#fff"
                  onValueChange={() => toggleSwitch('appointment_alerts')}
                  value={toggles.appointment_alerts}
                />
              </View>

              <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
                <View style={styles.settingInfo}>
                  <View
                    style={[
                      styles.iconWrapper,
                      {
                        backgroundColor: isDark ? 'rgba(193, 41, 46, 0.15)' : Palette.dangerSubtle,
                      },
                    ]}
                  >
                    <Pill size={20} color={Palette.danger} />
                  </View>
                  <View style={{ flex: 1, paddingRight: 16 }}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>
                      Medication Timers
                    </Text>
                    <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                      Scheduled daily dosage reminders
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: theme.border, true: accentColor }}
                  thumbColor="#fff"
                  onValueChange={() => toggleSwitch('medication_alerts')}
                  value={toggles.medication_alerts}
                />
              </View>

              <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
                <View style={styles.settingInfo}>
                  <View
                    style={[
                      styles.iconWrapper,
                      {
                        backgroundColor: isDark
                          ? 'rgba(224, 159, 62, 0.15)'
                          : Palette.warningSubtle,
                      },
                    ]}
                  >
                    <Activity size={20} color={Palette.warning} />
                  </View>
                  <View style={{ flex: 1, paddingRight: 16 }}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>
                      Diagnostic Lab Results
                    </Text>
                    <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                      Instant notification when test reports finalize
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: theme.border, true: accentColor }}
                  thumbColor="#fff"
                  onValueChange={() => toggleSwitch('lab_alerts')}
                  value={toggles.lab_alerts}
                />
              </View>

              <View style={[styles.settingItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                <View style={styles.settingInfo}>
                  <View
                    style={[
                      styles.iconWrapper,
                      { backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2 },
                    ]}
                  >
                    <Megaphone size={20} color={theme.textTertiary} />
                  </View>
                  <View style={{ flex: 1, paddingRight: 16 }}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>
                      Preventive Care Insights
                    </Text>
                    <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                      Seasonal health advisories and wellness checkups
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: theme.border, true: accentColor }}
                  thumbColor="#fff"
                  onValueChange={() => toggleSwitch('marketing_alerts')}
                  value={toggles.marketing_alerts}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Quiet Hours / Do Not Disturb
            </Text>

            <View
              style={[
                styles.dndCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Moon size={22} color={theme.textSecondary} />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>
                      Silence Non-Urgent Alerts
                    </Text>
                    <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                      Mutes non-critical reminders overnight
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: theme.border, true: accentColor }}
                  thumbColor="#fff"
                  onValueChange={() => toggleSwitch('dnd_enabled')}
                  value={toggles.dnd_enabled}
                />
              </View>

              <View
                style={[
                  styles.timeRow,
                  toggles.dnd_enabled ? {} : { opacity: 0.4 },
                  { borderTopColor: theme.border },
                ]}
              >
                <View style={styles.timeBlock}>
                  <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Starts At</Text>
                  <View
                    style={[
                      styles.timeInput,
                      {
                        backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Moon size={16} color={theme.textTertiary} />
                    <Text style={[styles.timeText, { color: theme.text }]}>
                      {toggles.dnd_start_time}
                    </Text>
                  </View>
                </View>
                <View style={styles.timeBlock}>
                  <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Ends At</Text>
                  <View
                    style={[
                      styles.timeInput,
                      {
                        backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Sun size={16} color={theme.textTertiary} />
                    <Text style={[styles.timeText, { color: theme.text }]}>
                      {toggles.dnd_end_time}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: Palette.sagePrimary }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Check size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.submitBtnText}>
              {saving ? 'Saving Preferences...' : 'Save Notification Preferences'}
            </Text>
          </TouchableOpacity>
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
  scroll: { padding: Spacing.four, paddingBottom: 60 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.three,
    marginTop: Spacing.two,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: Spacing.two },
  settingTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  settingDesc: { fontSize: 12 },
  section: { marginBottom: Spacing.two },
  dndCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  timeRow: {
    flexDirection: 'row',
    gap: Spacing.four,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
  timeBlock: { flex: 1 },
  timeLabel: { fontSize: 12, marginBottom: 6, fontWeight: '600' },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  timeText: { fontSize: 14, fontWeight: '700' },
  submitBtn: {
    flexDirection: 'row',
    height: 50,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
