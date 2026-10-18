import { router } from 'expo-router';
import { AlertCircle, ArrowLeft, PhoneCall, ShieldAlert } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Colors, Palette, Radius, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/useAuth';

export default function EmergencyContacts() {
  const { authenticatedFetch } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await authenticatedFetch('/api/users/emergency-contacts');
        if (res.ok) setContacts(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [authenticatedFetch]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Emergency Contacts</Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            Critical crisis lines & verified responders
          </Text>
        </View>
      </View>

      {/* Alert Banner */}
      <View
        style={[
          styles.alertBox,
          {
            backgroundColor: isDark ? 'rgba(193, 41, 46, 0.15)' : Palette.dangerSubtle,
            borderColor: Palette.danger,
          },
        ]}
      >
        <AlertCircle size={22} color={Palette.danger} style={{ marginTop: 2 }} />
        <Text style={[styles.alertText, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
          If you are experiencing a life-threatening medical emergency or severe distress, call
          local emergency services immediately or head to the nearest emergency room.
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={Palette.danger} size="large" />
          <Text style={{ marginTop: 12, color: theme.textSecondary, fontSize: 14 }}>
            Loading responder contacts...
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContent}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews
          ListEmptyComponent={
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <ShieldAlert size={40} color={theme.textTertiary} style={{ marginBottom: 12 }} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No Contacts Registered</Text>
              <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                Add trusted next-of-kin or emergency contacts in your profile settings.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={{ flex: 1, marginRight: Spacing.three }}>
                <Text style={[styles.contactName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.contactType, { color: theme.textTertiary }]}>
                  {item.type || 'Emergency Contact'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.callBtn, { backgroundColor: Palette.danger }]}
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
                activeOpacity={0.8}
              >
                <PhoneCall size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.callBtnText}>Call Now</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: 56,
    paddingBottom: Spacing.four,
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSub: { fontSize: 12, marginTop: 2 },
  alertBox: {
    margin: Spacing.four,
    flexDirection: 'row',
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  alertText: { fontSize: 13, lineHeight: 18, flex: 1, fontWeight: '500' },
  listContent: { paddingHorizontal: Spacing.four, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.three,
    borderLeftWidth: 4,
    borderLeftColor: Palette.danger,
  },
  contactName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  contactType: { fontSize: 12, textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5 },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  callBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  emptyCard: {
    padding: Spacing.eight,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
