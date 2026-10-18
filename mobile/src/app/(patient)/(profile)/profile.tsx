import { router } from 'expo-router';
import {
  ChevronRight,
  CreditCard,
  Edit3,
  FileText,
  Link2,
  LogOut,
  ShieldCheck,
  Watch,
} from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Palette, Radius, Spacing } from '../../../constants/theme';
import { useAuth } from '../../../context/useAuth';

export default function Profile() {
  const { user, logout } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const accentColor = isDark ? Palette.sageLuminous : Palette.sagePrimary;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Patient Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.avatarText, { color: theme.text }]}>
              {user?.username?.substring(0, 2).toUpperCase() || 'P'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: theme.text }]}>{user?.username || 'Patient'}</Text>
            <Text style={[styles.email, { color: theme.textSecondary }]}>{user?.email}</Text>
            <View
              style={[
                styles.memberBadge,
                { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
              ]}
            >
              <Text style={[styles.memberBadgeText, { color: accentColor }]}>
                ANSAEA VERIFIED MEMBER
              </Text>
            </View>
          </View>
        </View>

        {/* Clinical Records Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Clinical Records & Chart</Text>
          <View
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push('/(patient)/(profile)/records' as any)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
                  ]}
                >
                  <FileText size={18} color={accentColor} />
                </View>
                <Text style={[styles.rowText, { color: theme.text }]}>
                  Medical Records & Diagnostic Labs
                </Text>
              </View>
              <ChevronRight size={18} color={theme.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.row,
                { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 14, marginTop: 14 },
              ]}
              onPress={() => router.push('/(patient)/(profile)/edit_profile' as any)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: isDark ? 'rgba(64, 145, 108, 0.2)' : Palette.sageSubtle },
                  ]}
                >
                  <Edit3 size={18} color={Palette.success} />
                </View>
                <Text style={[styles.rowText, { color: theme.text }]}>Edit Personal Details</Text>
              </View>
              <ChevronRight size={18} color={theme.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.row,
                { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 14, marginTop: 14 },
              ]}
              onPress={() => router.push('/(patient)/(profile)/medical_history_setup' as any)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: isDark ? 'rgba(69, 123, 157, 0.2)' : Palette.infoSubtle },
                  ]}
                >
                  <ShieldCheck size={18} color={Palette.info} />
                </View>
                <Text style={[styles.rowText, { color: theme.text }]}>Medical History Setup</Text>
              </View>
              <ChevronRight size={18} color={theme.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Payments Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Wallet & Consult Credit</Text>
          <View
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
                ]}
              >
                <CreditCard size={20} color={accentColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600' }}>
                  AVAILABLE CREDIT
                </Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: accentColor }}>₹500.00</Text>
              </View>
              <TouchableOpacity
                style={[styles.smallBtn, { backgroundColor: Palette.sagePrimary }]}
                onPress={() => router.push('/(shared)/billing_invoices' as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.smallBtnText}>Invoices</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Integrations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Clinical Integrations</Text>
          <View
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <View style={styles.row}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2 },
                  ]}
                >
                  <Link2 size={18} color={theme.textSecondary} />
                </View>
                <Text style={[styles.rowText, { color: theme.text }]}>
                  Ayushman Bharat (ABHA ID Linked)
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.row,
                { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 14, marginTop: 14 },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2 },
                  ]}
                >
                  <Watch size={18} color={theme.textSecondary} />
                </View>
                <Text style={[styles.rowText, { color: theme.text }]}>
                  Apple Health / Google Fit Sync
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[
            styles.logoutBtn,
            { backgroundColor: isDark ? 'rgba(193, 41, 46, 0.15)' : Palette.dangerSubtle },
          ]}
          onPress={logout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={Palette.danger} />
          <Text style={[styles.logoutText, { color: Palette.danger }]}>Sign Out of Ansaea</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.four, paddingVertical: Spacing.four, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: '700' },
  scroll: { padding: Spacing.four, paddingBottom: 60 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    marginBottom: Spacing.six,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarText: { fontSize: 24, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700' },
  email: { fontSize: 13, marginTop: 2 },
  memberBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: 6,
  },
  memberBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  section: { marginBottom: Spacing.five },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: Spacing.three },
  card: { padding: Spacing.four, borderRadius: Radius.lg, borderWidth: 1 },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowText: { fontSize: 14, fontWeight: '600' },
  smallBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.md },
  smallBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 15,
    borderRadius: Radius.md,
    marginTop: Spacing.two,
  },
  logoutText: { fontWeight: '700', fontSize: 15 },
});
