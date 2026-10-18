import { router } from 'expo-router';
import { Activity, Brain, Calendar, ChevronRight, Heart } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette } from '../../constants/theme';
import { useAuth } from '../../context/useAuth';

export default function PatientDashboard() {
  const { user, authenticatedFetch } = useAuth();
  const [latestVitals, setLatestVitals] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const fetchVitals = async () => {
    try {
      const res = await authenticatedFetch('/api/tracker/vitals');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setLatestVitals(data[0]);
        } else {
          setLatestVitals(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVitals();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchVitals();
  }, []);

  const accentColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;
  const cardBg = isDark ? Palette.surfaceDark1 : Palette.surfaceWarm1;
  const borderColor = isDark ? Palette.borderDark : Palette.borderWarm;
  const textColor = isDark ? Palette.textDarkPrimary : Palette.textWarmPrimary;
  const subtextColor = isDark ? Palette.textDarkSecondary : Palette.textWarmSecondary;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? Palette.surfaceDark0 : Palette.surfaceWarm0 },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accentColor} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>
            Hello, {user?.username || 'Patient'}
          </Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            Let's check in on your health today.
          </Text>
        </View>

        {/* Daily Vitals Card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: isDark ? 'rgba(82, 183, 136, 0.15)' : 'rgba(45, 106, 79, 0.1)' },
              ]}
            >
              <Activity size={18} color={accentColor} />
            </View>
            <Text style={[styles.cardTitle, { color: textColor }]}>Daily Vitals</Text>
          </View>
          {latestVitals ? (
            <View style={{ gap: 4, marginBottom: 8 }}>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Heart Rate:{' '}
                <Text style={{ fontWeight: '600', color: textColor }}>
                  {latestVitals.heart_rate || '--'} BPM
                </Text>
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Blood Oxygen:{' '}
                <Text style={{ fontWeight: '600', color: textColor }}>
                  {latestVitals.spo2 || '--'}% SpO2
                </Text>
              </Text>
            </View>
          ) : (
            <Text style={[styles.cardDesc, { color: subtextColor, marginBottom: 8 }]}>
              No vitals logged today yet.
            </Text>
          )}
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderColor: accentColor,
                backgroundColor: isDark ? 'rgba(82, 183, 136, 0.12)' : 'rgba(45, 106, 79, 0.08)',
              },
            ]}
            onPress={() => router.push('/(patient)/(metrics)/vitals')}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: accentColor }]}>Log Vitals</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Action Bento Grid */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.card, { flex: 1, marginRight: 8, backgroundColor: cardBg, borderColor }]}
            onPress={() => router.push('/(patient)/(metrics)/self_care' as any)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: 'rgba(239, 68, 68, 0.1)', marginBottom: 8 },
              ]}
            >
              <Heart size={18} color="#ef4444" />
            </View>
            <Text style={[styles.cardTitle, { color: textColor, marginLeft: 0 }]}>Self-Care</Text>
            <Text style={[styles.cardDesc, { color: subtextColor }]}>Habits & Hydration</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { flex: 1, marginLeft: 8, backgroundColor: cardBg, borderColor }]}
            onPress={() => router.push('/(patient)/(metrics)/mood_check_in' as any)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: 'rgba(139, 92, 246, 0.1)', marginBottom: 8 },
              ]}
            >
              <Brain size={18} color="#8b5cf6" />
            </View>
            <Text style={[styles.cardTitle, { color: textColor, marginLeft: 0 }]}>
              Mood Check-In
            </Text>
            <Text style={[styles.cardDesc, { color: subtextColor }]}>Log Emotional State</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Consultations Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: cardBg, borderColor }]}
          onPress={() => router.push('/(patient)/appointments' as any)}
          activeOpacity={0.7}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Calendar size={18} color="#10b981" />
              </View>
              <Text style={[styles.cardTitle, { color: textColor }]}>Consultation Sessions</Text>
            </View>
            <ChevronRight size={18} color={subtextColor} />
          </View>
          <Text style={[styles.cardDesc, { color: subtextColor }]}>
            View your upcoming medical consultations or schedule a new appointment.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, marginTop: 4 },
  card: { padding: 18, borderRadius: 14, marginBottom: 16, borderWidth: 1 },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: { flexDirection: 'row', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginLeft: 10 },
  cardDesc: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  button: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12, borderWidth: 1 },
  buttonText: { fontWeight: '600', fontSize: 14 },
});
