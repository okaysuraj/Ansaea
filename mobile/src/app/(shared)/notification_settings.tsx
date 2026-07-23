import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Bell, Mail, MessageSquare, Calendar, Pill, Activity, Megaphone, Moon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';

export default function NotificationSettings() {
  const { authenticatedFetch } = useAuth();
  const [toggles, setToggles] = useState({
    push_enabled: true,
    email_enabled: true,
    sms_enabled: false,
    appointment_alerts: true,
    medication_alerts: true,
    lab_alerts: true,
    marketing_alerts: false,
    dnd_enabled: false,
    dnd_start_time: "22:00",
    dnd_end_time: "07:00"
  });
  const [loading, setLoading] = useState(true);

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
            dnd_start_time: data.dnd_start_time ?? "22:00",
            dnd_end_time: data.dnd_end_time ?? "07:00"
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, [authenticatedFetch]);

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      const res = await authenticatedFetch('/api/patients/notifications', {
        method: 'PUT',
        body: JSON.stringify(toggles)
      });
      if (res.ok) {
        alert('Notification Preferences Saved!');
        router.back();
      }
    } catch (err) {
      console.error(err);
      alert('Error saving preferences');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <Text style={styles.sectionTitle}>Delivery Methods</Text>
          
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(14, 165, 233, 0.1)' }]}>
                  <Bell size={20} color="#0ea5e9" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingDesc}>Real-time alerts on device</Text>
                </View>
              </View>
              <Switch trackColor={{ false: '#334155', true: '#0ea5e9' }} thumbColor="#fff" onValueChange={() => toggleSwitch('push_enabled')} value={toggles.push_enabled} />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
                  <Mail size={20} color="#a855f7" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Email Updates</Text>
                  <Text style={styles.settingDesc}>Detailed reports</Text>
                </View>
              </View>
              <Switch trackColor={{ false: '#334155', true: '#a855f7' }} thumbColor="#fff" onValueChange={() => toggleSwitch('email_enabled')} value={toggles.email_enabled} />
            </View>

            <View style={[styles.settingItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <MessageSquare size={20} color="#10b981" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>SMS / Text</Text>
                  <Text style={styles.settingDesc}>Critical alerts</Text>
                </View>
              </View>
              <Switch trackColor={{ false: '#334155', true: '#10b981' }} thumbColor="#fff" onValueChange={() => toggleSwitch('sms_enabled')} value={toggles.sms_enabled} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alert Categories</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconWrapper, { backgroundColor: '#1E293B' }]}>
                  <Calendar size={20} color="#0ea5e9" />
                </View>
                <View style={{ flex: 1, paddingRight: 16 }}>
                  <Text style={styles.settingTitle}>Appointment Reminders</Text>
                  <Text style={styles.settingDesc}>24h & 1h before visits</Text>
                </View>
              </View>
              <Switch trackColor={{ false: '#334155', true: '#0ea5e9' }} thumbColor="#fff" onValueChange={() => toggleSwitch('appointment_alerts')} value={toggles.appointment_alerts} />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconWrapper, { backgroundColor: '#1E293B' }]}>
                  <Pill size={20} color="#ef4444" />
                </View>
                <View style={{ flex: 1, paddingRight: 16 }}>
                  <Text style={styles.settingTitle}>Medication Alerts</Text>
                  <Text style={styles.settingDesc}>Daily dosage reminders</Text>
                </View>
              </View>
              <Switch trackColor={{ false: '#334155', true: '#ef4444' }} thumbColor="#fff" onValueChange={() => toggleSwitch('medication_alerts')} value={toggles.medication_alerts} />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconWrapper, { backgroundColor: '#1E293B' }]}>
                  <Activity size={20} color="#a855f7" />
                </View>
                <View style={{ flex: 1, paddingRight: 16 }}>
                  <Text style={styles.settingTitle}>Lab Results</Text>
                  <Text style={styles.settingDesc}>When new tests are ready</Text>
                </View>
              </View>
              <Switch trackColor={{ false: '#334155', true: '#a855f7' }} thumbColor="#fff" onValueChange={() => toggleSwitch('lab_alerts')} value={toggles.lab_alerts} />
            </View>

            <View style={[styles.settingItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconWrapper, { backgroundColor: '#1E293B' }]}>
                  <Megaphone size={20} color="#64748b" />
                </View>
                <View style={{ flex: 1, paddingRight: 16 }}>
                  <Text style={styles.settingTitle}>Marketing & Newsletter</Text>
                  <Text style={styles.settingDesc}>Wellness tips and news</Text>
                </View>
              </View>
              <Switch trackColor={{ false: '#334155', true: '#94A3B8' }} thumbColor="#fff" onValueChange={() => toggleSwitch('marketing_alerts')} value={toggles.marketing_alerts} />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quiet Moments</Text>
            </View>

            <View style={styles.dndCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Moon size={24} color="#64748b" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.settingTitle}>Do Not Disturb</Text>
                    <Text style={styles.settingDesc}>Silence non-critical alerts</Text>
                  </View>
                </View>
                <Switch trackColor={{ false: '#334155', true: '#64748b' }} thumbColor="#fff" onValueChange={() => toggleSwitch('dnd_enabled')} value={toggles.dnd_enabled} />
              </View>

              <View style={[styles.timeRow, toggles.dnd_enabled ? {} : { opacity: 0.4 }]}>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>Start Time</Text>
                  <View style={styles.timeInput}>
                    <Moon size={16} color="#94A3B8" />
                    <Text style={styles.timeText}>{toggles.dnd_start_time}</Text>
                  </View>
                </View>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>End Time</Text>
                  <View style={styles.timeInput}>
                    <Sun size={16} color="#94A3B8" />
                    <Text style={styles.timeText}>{toggles.dnd_end_time}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
            <Text style={styles.submitBtnText}>Save Preferences</Text>
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
  scroll: { padding: 16, paddingBottom: 40 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 12, marginTop: 8 },
  badge: { backgroundColor: '#1E293B', color: '#94A3B8', fontSize: 12, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  card: { backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 1, borderColor: '#334155', padding: 16, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  textContainer: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 2 },
  desc: { fontSize: 13, color: '#94A3B8' },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 16 },
  submitBtn: { backgroundColor: '#0ea5e9', height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
