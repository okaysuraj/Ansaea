import { router } from 'expo-router';
import { Calendar, Clock, MessageSquare, Phone, Video } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Palette, Radius, Spacing } from '../../../constants/theme';
import { useAuth } from '../../../context/useAuth';

export default function MyAppointments() {
  const { authenticatedFetch } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const fetchAppointments = async () => {
    try {
      const response = await authenticatedFetch('/api/psychiatrists/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Error fetching appointments:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    Alert.alert(
      'Cancel Consultation',
      'Are you sure you want to cancel this scheduled consultation?',
      [
        { text: 'Keep Appointment', style: 'cancel' },
        {
          text: 'Cancel Appointment',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await authenticatedFetch(
                `/api/psychiatrists/appointments/${id}/cancel`,
                { method: 'POST' },
              );
              if (response.ok) fetchAppointments();
            } catch (e) {
              console.error(e);
            }
          },
        },
      ],
    );
  };

  const handleJoin = (appt: any) => {
    router.push({
      pathname: '/(shared)/video_call' as any,
      params: { appointmentId: appt.id },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>My Sessions</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Palette.sagePrimary} />
          <Text style={{ marginTop: 12, color: theme.textSecondary, fontSize: 14 }}>
            Loading clinical sessions...
          </Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(appt) => appt.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.scroll}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Calendar size={48} color={theme.textTertiary} style={{ marginBottom: 16 }} />
              <Text style={{ color: theme.text, fontSize: 17, fontWeight: '700', marginBottom: 6 }}>
                No Upcoming Sessions
              </Text>
              <Text
                style={{
                  color: theme.textSecondary,
                  textAlign: 'center',
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                Book an appointment with a specialist from the directory to start care.
              </Text>
            </View>
          }
          renderItem={({ item: appt }) => (
            <View
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: Spacing.three }}>
                  <Text style={[styles.docName, { color: theme.text }]}>
                    {appt.doctor_name || 'Attending Physician'}
                  </Text>
                  <Text
                    style={[
                      styles.docSpec,
                      { color: isDark ? Palette.sageLuminous : Palette.sagePrimary },
                    ]}
                  >
                    {appt.doctor_specialty || 'Clinical Specialist'}
                  </Text>
                  <View style={styles.timeRow}>
                    <Clock size={13} color={theme.textTertiary} style={{ marginRight: 4 }} />
                    <Text style={[styles.date, { color: theme.textSecondary }]}>
                      {appt.date} • {appt.time_slot}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
                  ]}
                >
                  {appt.session_type === 'video' ? (
                    <Video size={20} color={isDark ? Palette.sageLuminous : Palette.sagePrimary} />
                  ) : appt.session_type === 'call' ? (
                    <Phone size={20} color={isDark ? Palette.sageLuminous : Palette.sagePrimary} />
                  ) : (
                    <MessageSquare
                      size={20}
                      color={isDark ? Palette.sageLuminous : Palette.sagePrimary}
                    />
                  )}
                </View>
              </View>

              {appt.status === 'upcoming' ? (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.joinBtn, { backgroundColor: Palette.sagePrimary }]}
                    onPress={() => handleJoin(appt)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.joinText}>Join Session</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.cancelBtn,
                      {
                        backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => handleCancel(appt.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                      Reschedule / Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={[
                    styles.statusBanner,
                    {
                      backgroundColor:
                        appt.status === 'cancelled'
                          ? isDark
                            ? 'rgba(193, 41, 46, 0.15)'
                            : Palette.dangerSubtle
                          : isDark
                            ? 'rgba(64, 145, 108, 0.2)'
                            : Palette.sageSubtle,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        appt.status === 'cancelled'
                          ? Palette.danger
                          : isDark
                            ? Palette.sageLuminous
                            : Palette.sagePrimary,
                      fontWeight: '700',
                      fontSize: 12,
                      textTransform: 'uppercase',
                    }}
                  >
                    {appt.status}
                  </Text>
                </View>
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.four, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: '700' },
  scroll: { padding: Spacing.four, paddingBottom: 60 },
  card: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    marginBottom: Spacing.three,
    borderWidth: 1,
  },
  docName: { fontSize: 17, fontWeight: '700' },
  docSpec: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  date: { fontSize: 13 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.four },
  joinBtn: { flex: 1, paddingVertical: 12, borderRadius: Radius.md, alignItems: 'center' },
  joinText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelText: { fontWeight: '600', fontSize: 13 },
  statusBanner: {
    marginTop: Spacing.three,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
});
