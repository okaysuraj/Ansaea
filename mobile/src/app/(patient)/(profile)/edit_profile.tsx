import { router } from 'expo-router';
import { ArrowLeft, Calendar, Camera, Check, Lock, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

export default function EditProfile() {
  const { user, authenticatedFetch } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const [formData, setFormData] = useState({
    full_name: '',
    email: user?.email || '',
    phone_number: '',
    dob: '',
  });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authenticatedFetch('/api/patients/profile');
        if (res.ok) {
          const data = await res.json();
          setFormData({
            full_name: data.full_name || user?.username || '',
            email: user?.email || '',
            phone_number: data.phone_number || '',
            dob: data.dob || '',
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [authenticatedFetch, user]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await authenticatedFetch('/api/patients/profile', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: formData.full_name,
          dob: formData.dob,
          phone_number: formData.phone_number,
        }),
      });
      if (res.ok) {
        Alert.alert('Success', 'Profile details saved successfully.');
        router.back();
      } else {
        Alert.alert('Error', 'Unable to update profile.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Personal Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
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
              <TouchableOpacity
                style={[
                  styles.cameraBtn,
                  { backgroundColor: Palette.sagePrimary, borderColor: theme.background },
                ]}
                activeOpacity={0.85}
              >
                <Camera size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.name, { color: theme.text }]}>
              {formData.full_name || user?.username}
            </Text>
            <Text style={[styles.subtext, { color: theme.textSecondary }]}>
              Ansaea Patient Member
            </Text>
          </View>

          {/* Verification Badge */}
          <View
            style={[
              styles.verificationCard,
              {
                backgroundColor: isDark ? 'rgba(64, 145, 108, 0.15)' : Palette.sageSubtle,
                borderColor: Palette.success,
              },
            ]}
          >
            <View style={styles.verificationHeader}>
              <Shield size={18} color={Palette.success} />
              <Text
                style={[
                  styles.verificationTitle,
                  { color: isDark ? Palette.sageLuminous : Palette.sageDark },
                ]}
              >
                Verified Identity Chart
              </Text>
            </View>
            <Text
              style={[
                styles.verificationDesc,
                { color: isDark ? Palette.textDarkSecondary : Palette.sageDark },
              ]}
            >
              Your clinical identity and government identifiers have been cryptographically verified
              for secure electronic prescriptions and medical record access.
            </Text>
          </View>

          {/* Personal Info Form */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Personal Information</Text>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Full Legal Name</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
                ]}
                value={formData.full_name}
                onChangeText={(t) => handleChange('full_name', t)}
                placeholderTextColor={theme.textTertiary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Date of Birth</Text>
              <View
                style={[
                  styles.inputWithIcon,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <TextInput
                  style={[styles.inputInner, { color: theme.text }]}
                  value={formData.dob}
                  onChangeText={(t) => handleChange('dob', t)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.textTertiary}
                />
                <Calendar size={18} color={theme.textTertiary} style={{ marginRight: 14 }} />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Email Address (Read-only)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? Palette.surfaceDark2 : Palette.surfaceWarm2,
                    color: theme.textSecondary,
                    borderColor: theme.border,
                  },
                ]}
                value={formData.email}
                editable={false}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Contact Phone Number
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
                ]}
                value={formData.phone_number}
                onChangeText={(t) => handleChange('phone_number', t)}
                keyboardType="phone-pad"
                placeholder="+1 (555) 000-0000"
                placeholderTextColor={theme.textTertiary}
              />
            </View>
          </View>

          {/* Privacy Note */}
          <View
            style={[
              styles.privacyCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View
              style={[
                styles.privacyIconWrapper,
                { backgroundColor: isDark ? 'rgba(45, 106, 79, 0.25)' : Palette.sageSubtle },
              ]}
            >
              <Lock size={18} color={isDark ? Palette.sageLuminous : Palette.sagePrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.privacyTitle, { color: theme.text }]}>HIPAA & Data Privacy</Text>
              <Text style={[styles.privacyDesc, { color: theme.textSecondary }]}>
                Your health data is protected with 256-bit encryption. Ansaea never monetizes or
                shares your private medical history.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: Palette.sagePrimary }]}
            onPress={handleSubmit}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Check size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.submitBtnText}>
              {saving ? 'Saving...' : 'Save Profile Changes'}
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
  avatarSection: { alignItems: 'center', marginBottom: Spacing.five },
  avatarWrapper: { position: 'relative', marginBottom: Spacing.three },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarText: { fontSize: 32, fontWeight: '700' },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 2 },
  subtext: { fontSize: 13 },
  verificationCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.five,
  },
  verificationHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  verificationTitle: { fontSize: 14, fontWeight: '700' },
  verificationDesc: { fontSize: 13, lineHeight: 18 },
  section: { marginBottom: Spacing.five },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.four },
  formGroup: { marginBottom: Spacing.four },
  label: { fontSize: 13, marginBottom: 6, fontWeight: '600' },
  input: {
    height: 48,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    fontSize: 15,
    borderWidth: 1,
  },
  inputWithIcon: {
    height: 48,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  inputInner: { flex: 1, height: '100%', paddingHorizontal: Spacing.four, fontSize: 15 },
  privacyCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    marginBottom: Spacing.five,
  },
  privacyIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  privacyDesc: { fontSize: 12, lineHeight: 17 },
  submitBtn: {
    flexDirection: 'row',
    height: 50,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
