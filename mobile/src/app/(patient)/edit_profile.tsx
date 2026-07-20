import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Camera, Shield, FileText, Lock, Calendar } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';

export default function EditProfile() {
  const { user, authenticatedFetch } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: user?.email || '',
    phone_number: '',
    dob: ''
  });
  const [loading, setLoading] = useState(true);

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
            dob: data.dob || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authenticatedFetch, user]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await authenticatedFetch('/api/patients/profile', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: formData.full_name,
          dob: formData.dob,
          phone_number: formData.phone_number
        })
      });
      if (res.ok) {
        alert('Profile updated successfully!');
        router.back();
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
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
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.username?.substring(0,2).toUpperCase() || 'U'}</Text>
              </View>
              <TouchableOpacity style={styles.cameraBtn}>
                <Camera size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{user?.username}</Text>
            <Text style={styles.subtext}>Patient Member</Text>
          </View>

          {/* Verification Badge */}
          <View style={styles.verificationCard}>
            <View style={styles.verificationHeader}>
              <Shield size={20} color="#10b981" />
              <Text style={styles.verificationTitle}>Verified Profile</Text>
            </View>
            <Text style={styles.verificationDesc}>
              Your identity was verified securely. This allows access to shared medical records.
            </Text>
          </View>

          {/* Personal Info Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input} 
                value={formData.full_name} 
                onChangeText={(t) => handleChange('full_name', t)} 
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <View style={styles.inputWithIcon}>
                <TextInput 
                  style={[styles.input, { flex: 1, borderWidth: 0 }]} 
                  value={formData.dob} 
                  onChangeText={(t) => handleChange('dob', t)} 
                  placeholder="MM / DD / YYYY"
                  placeholderTextColor="#64748b"
                />
                <Calendar size={20} color="#64748b" style={{ marginRight: 12 }} />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput 
                style={styles.input} 
                value={formData.email} 
                onChangeText={(t) => handleChange('email', t)} 
                keyboardType="email-address"
                placeholderTextColor="#64748b"
                editable={false}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input} 
                value={formData.phone_number} 
                onChangeText={(t) => handleChange('phone_number', t)} 
                keyboardType="phone-pad"
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          {/* Privacy Note */}
          <View style={styles.privacyCard}>
            <View style={styles.privacyIconWrapper}>
              <Lock size={20} color="#0ea5e9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.privacyTitle}>HIPAA Compliance</Text>
              <Text style={styles.privacyDesc}>
                Your data is encrypted and securely stored. We never share contact info.
              </Text>
            </View>
          </View>

          {/* Security & Consent Links */}
          <TouchableOpacity style={styles.linkRow}>
            <View style={[styles.linkIconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Shield size={20} color="#10b981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.linkTitle}>Two-Factor Auth</Text>
              <Text style={[styles.linkSubtext, { color: '#10b981' }]}>Enabled</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow}>
            <View style={[styles.linkIconWrapper, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
              <FileText size={20} color="#a855f7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.linkTitle}>Legal Consent</Text>
              <Text style={styles.linkSubtext}>4 Active Forms</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Save Changes</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  scroll: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#1E293B' },
  avatarText: { fontSize: 36, color: '#94A3B8', fontWeight: 'bold' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#0ea5e9', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#0F172A' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  subtext: { fontSize: 14, color: '#94A3B8' },
  verificationCard: { backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)', marginBottom: 24 },
  verificationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  verificationTitle: { fontSize: 16, fontWeight: 'bold', color: '#10b981' },
  verificationDesc: { fontSize: 14, color: '#94A3B8', lineHeight: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 16 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#94A3B8', marginBottom: 8 },
  input: { backgroundColor: '#1E293B', color: '#F8FAFC', paddingHorizontal: 16, height: 50, borderRadius: 10, fontSize: 16 },
  inputWithIcon: { backgroundColor: '#1E293B', borderRadius: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  privacyCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, flexDirection: 'row', gap: 16, marginBottom: 24 },
  privacyIconWrapper: { backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: 10, borderRadius: 8, height: 40 },
  privacyTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  privacyDesc: { fontSize: 14, color: '#94A3B8', lineHeight: 20 },
  linkRow: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  linkIconWrapper: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  linkTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 2 },
  linkSubtext: { fontSize: 12, color: '#94A3B8' },
  submitBtn: { backgroundColor: '#0ea5e9', height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
