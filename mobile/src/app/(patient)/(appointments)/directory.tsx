import {
  Award,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Video,
  X,
} from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Palette, Radius, Spacing } from '../../../constants/theme';
import { useAuth } from '../../../context/useAuth';

export default function FindDoctors() {
  const { authenticatedFetch } = useAuth();
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [sessionType, setSessionType] = useState('video');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const bookingDate = new Date().toISOString().split('T')[0];
  const [isBooking, setIsBooking] = useState(false);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const availableSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await authenticatedFetch('/api/psychiatrists');
      if (response.ok) {
        const data = await response.json();
        setDoctors(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Error fetching doctors:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (doc: any) => {
    setSelectedDoctor(doc);
    setTimeSlot('10:00 AM');
    setSessionType('video');
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctor) return;
    setIsBooking(true);
    try {
      const response = await authenticatedFetch('/api/psychiatrists/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: selectedDoctor.id,
          date: bookingDate,
          time_slot: timeSlot,
          session_type: sessionType,
        }),
      });
      if (response.ok) {
        Alert.alert(
          'Consultation Confirmed',
          `Your appointment with ${selectedDoctor.name} is booked for ${bookingDate} at ${timeSlot}!`,
        );
        setSelectedDoctor(null);
      } else {
        const err = await response.json();
        Alert.alert('Booking Notice', err.detail || 'Selected slot is no longer available.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network connection failed');
    } finally {
      setIsBooking(false);
    }
  };

  const filteredDoctors = doctors.filter(
    (doc) =>
      (doc.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.specialty || '').toLowerCase().includes(search.toLowerCase()),
  );

  const renderDoctorItem = useCallback(
    ({ item: doc }: { item: any }) => (
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', gap: Spacing.four }}>
          <Image
            source={{
              uri:
                doc.imageUrl ||
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
            }}
            style={styles.image}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={[styles.name, { color: theme.text }]}>{doc.name}</Text>
              <ShieldCheck size={16} color={isDark ? Palette.sageLuminous : Palette.sagePrimary} />
            </View>
            <Text
              style={[styles.spec, { color: isDark ? Palette.sageLuminous : Palette.sagePrimary }]}
            >
              {doc.specialty || 'General Practitioner'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2 },
                ]}
              >
                <Star size={12} color={Palette.warning} />
                <Text style={[styles.badgeText, { color: theme.textSecondary }]}>
                  {doc.rating || '4.9'}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2 },
                ]}
              >
                <Award size={12} color={isDark ? Palette.sageLuminous : Palette.sagePrimary} />
                <Text style={[styles.badgeText, { color: theme.textSecondary }]}>
                  {doc.experience_years || '5'} Yrs Exp
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <Text style={[styles.price, { color: theme.text }]}>
            ${doc.session_price || '120'}{' '}
            <Text style={{ fontSize: 12, fontWeight: 'normal', color: theme.textSecondary }}>
              / session
            </Text>
          </Text>
          <TouchableOpacity
            style={[styles.bookBtn, { backgroundColor: Palette.sagePrimary }]}
            onPress={() => handleOpenBooking(doc)}
            activeOpacity={0.85}
          >
            <Text style={styles.bookText}>Select Slot</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [theme, isDark],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Find Specialists</Text>
        <View
          style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <Search size={18} color={theme.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search by physician or specialty..."
            placeholderTextColor={theme.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Palette.sagePrimary} />
          <Text style={{ marginTop: 12, color: theme.textSecondary, fontSize: 14 }}>
            Connecting to directory...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderDoctorItem}
          contentContainerStyle={styles.scroll}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ color: theme.textSecondary, fontSize: 15 }}>
                No matching specialists found.
              </Text>
            </View>
          }
        />
      )}

      {/* Booking Slot Selection Modal */}
      {selectedDoctor && (
        <Modal transparent animationType="slide" visible={!!selectedDoctor}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View style={styles.modalHeader}>
                <View>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Book Consultation</Text>
                  <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
                    {selectedDoctor.name}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedDoctor(null)} activeOpacity={0.7}>
                  <X size={22} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>
                Consultation Mode
              </Text>
              <View style={styles.modeRow}>
                {[
                  { id: 'video', label: 'Video Call', icon: Video },
                  { id: 'call', label: 'Audio Voice', icon: Phone },
                  { id: 'chat', label: 'Secure Chat', icon: MessageSquare },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSel = sessionType === mode.id;
                  return (
                    <TouchableOpacity
                      key={mode.id}
                      style={[
                        styles.modeBtn,
                        {
                          backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2,
                          borderColor: theme.border,
                        },
                        isSel && {
                          backgroundColor: Palette.sagePrimary,
                          borderColor: Palette.sagePrimary,
                        },
                      ]}
                      onPress={() => setSessionType(mode.id)}
                      activeOpacity={0.8}
                    >
                      <Icon size={16} color={isSel ? '#fff' : theme.text} />
                      <Text style={[styles.modeBtnText, { color: isSel ? '#fff' : theme.text }]}>
                        {mode.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>
                Available Slots Today
              </Text>
              <View style={styles.slotsGrid}>
                {availableSlots.map((slot) => {
                  const isSel = timeSlot === slot;
                  return (
                    <TouchableOpacity
                      key={slot}
                      style={[
                        styles.slotChip,
                        {
                          backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2,
                          borderColor: theme.border,
                        },
                        isSel && {
                          backgroundColor: Palette.sagePrimary,
                          borderColor: Palette.sagePrimary,
                        },
                      ]}
                      onPress={() => setTimeSlot(slot)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.slotChipText, { color: isSel ? '#fff' : theme.text }]}>
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[
                    styles.confirmBtn,
                    { backgroundColor: Palette.sagePrimary },
                    isBooking && { opacity: 0.6 },
                  ]}
                  onPress={handleConfirmBooking}
                  disabled={isBooking}
                  activeOpacity={0.85}
                >
                  <Text style={styles.confirmBtnText}>
                    {isBooking
                      ? 'Securing Slot...'
                      : `Confirm & Schedule ($${selectedDoctor.session_price || '120'})`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.four, paddingBottom: Spacing.two },
  title: { fontSize: 24, fontWeight: '700', marginBottom: Spacing.three },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
  scroll: { padding: Spacing.four, paddingBottom: 60 },
  card: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    marginBottom: Spacing.three,
    borderWidth: 1,
  },
  image: { width: 68, height: 68, borderRadius: 34 },
  name: { fontSize: 17, fontWeight: '700' },
  spec: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  badgeText: { fontSize: 12, fontWeight: '500' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
  price: { fontSize: 16, fontWeight: '700' },
  bookBtn: { paddingHorizontal: Spacing.four, paddingVertical: 10, borderRadius: Radius.md },
  bookText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.six,
    borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.four,
  },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  modalSub: { fontSize: 13, marginTop: 2 },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: Spacing.three,
    letterSpacing: 0.5,
  },
  modeRow: { flexDirection: 'row', gap: Spacing.two },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  modeBtnText: { fontWeight: '600', fontSize: 12 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.md, borderWidth: 1 },
  slotChipText: { fontSize: 12, fontWeight: '600' },
  modalFooter: { marginTop: Spacing.five },
  confirmBtn: { paddingVertical: 15, borderRadius: Radius.md, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
