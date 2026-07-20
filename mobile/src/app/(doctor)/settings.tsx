import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, User, Shield, Globe, Bell, Share2, FileCheck, HelpCircle, Headset, LogOut } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';

export default function SettingsHome() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const settingsCards = [
    { icon: User, title: 'Profile', desc: 'Public info & credentials.', color: '#0070eb', bg: 'rgba(0, 112, 235, 0.1)' },
    { icon: Shield, title: 'Security', desc: '2FA & active sessions.', color: '#6664e4', bg: 'rgba(102, 100, 228, 0.1)' },
    { icon: Globe, title: 'Language', desc: 'Display & region formatting.', color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.1)' },
    { icon: Bell, title: 'Notifications', desc: 'Email, SMS & alerts.', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { icon: Share2, title: 'Data sharing', desc: 'Data export & integrations.', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.1)' },
    { icon: FileCheck, title: 'Consent', desc: 'Legal agreements & privacy.', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    { icon: HelpCircle, title: 'Help Center', desc: 'Tutorials & FAQs.', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { icon: Headset, title: 'Contact us', desc: 'Technical & clinical support.', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Profile Header */}
        <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/(doctor)/profile')}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarText}>{user?.username?.substring(0, 2).toUpperCase() || 'DR'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Dr. {user?.username}</Text>
            <Text style={styles.subtext}>Senior Endocrinologist</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Active Status</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Global Settings</Text>

        <View style={styles.grid}>
          {settingsCards.map((card, i) => (
            <TouchableOpacity key={i} style={styles.gridCard}>
              <View style={[styles.iconWrapper, { backgroundColor: card.bg }]}>
                <card.icon size={24} color={card.color} />
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{card.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>System Version: v2.4.1-stable</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  scroll: { padding: 16, paddingBottom: 40 },
  profileCard: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#334155', alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#334155', borderWidth: 2, borderColor: '#10b981', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC' },
  profileInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  subtext: { fontSize: 14, color: '#94A3B8', marginBottom: 8 },
  statusBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, color: '#10b981', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { width: '48%', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  iconWrapper: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 18 },
  footer: { marginTop: 24, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 24, alignItems: 'center' },
  versionText: { fontSize: 12, color: '#64748b', marginBottom: 16 },
  logoutBtn: { flexDirection: 'row', backgroundColor: 'rgba(239, 68, 68, 0.1)', width: '100%', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8 },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' }
});
