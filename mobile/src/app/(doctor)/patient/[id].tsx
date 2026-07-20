import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, MessageCircle, Phone, Calendar, HeartPulse, Activity, AlertTriangle, Pill } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';

export default function PatientProfileMobileView() {
  const { id } = useLocalSearchParams();
  const { authenticatedFetch } = useAuth();
  
  // Dummy Data for Phase 1
  const patient = {
    name: 'Robert Henderson',
    age: 45,
    patientId: 'ME-8829',
    vitals: {
      heartRate: 72,
      bp: '118/76',
      spo2: 98,
      temp: 36.8
    },
    medications: [
      { name: 'Lisinopril 10mg', freq: 'Once daily, morning', refill: '12 days' },
      { name: 'Atorvastatin 20mg', freq: 'Once daily, bedtime', refill: '45 days' }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#0ea5e9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MedPro Central</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Profile Info */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>RH</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{patient.name}</Text>
              <Text style={styles.subtext}>{patient.age} years old • #{patient.patientId}</Text>
            </View>
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.primaryBtn}>
              <MessageCircle size={20} color="#fff" />
              <Text style={styles.btnText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Phone size={20} color="#0ea5e9" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Calendar size={20} color="#0ea5e9" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Vitals Stats */}
        <Text style={styles.sectionTitle}>
          <HeartPulse size={18} color="#0ea5e9" /> Vital Stats
        </Text>
        <View style={styles.grid}>
          <View style={[styles.gridCard, { borderLeftColor: '#ef4444' }]}>
            <Text style={styles.gridLabel}>HEART RATE</Text>
            <Text style={styles.gridValue}>{patient.vitals.heartRate} <Text style={styles.gridUnit}>BPM</Text></Text>
          </View>
          <View style={[styles.gridCard, { borderLeftColor: '#0ea5e9' }]}>
            <Text style={styles.gridLabel}>BP</Text>
            <Text style={styles.gridValue}>{patient.vitals.bp} <Text style={styles.gridUnit}>mmHg</Text></Text>
          </View>
          <View style={[styles.gridCard, { borderLeftColor: '#10b981' }]}>
            <Text style={styles.gridLabel}>SPO2</Text>
            <Text style={styles.gridValue}>{patient.vitals.spo2} <Text style={styles.gridUnit}>%</Text></Text>
          </View>
          <View style={[styles.gridCard, { borderLeftColor: '#f59e0b' }]}>
            <Text style={styles.gridLabel}>TEMP</Text>
            <Text style={styles.gridValue}>{patient.vitals.temp} <Text style={styles.gridUnit}>°C</Text></Text>
          </View>
        </View>

        {/* Active Medications */}
        <Text style={styles.sectionTitle}>
          <Pill size={18} color="#0ea5e9" /> Active Medications
        </Text>
        <View style={styles.medCardList}>
          {patient.medications.map((med, i) => (
            <View key={i} style={styles.medRow}>
              <View style={styles.medIconWrapper}>
                <Pill size={20} color="#0ea5e9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.subtext}>{med.freq}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={styles.badge}><Text style={styles.badgeText}>Active</Text></View>
                <Text style={styles.subtext}>Refill: {med.refill}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Clinical Note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Clinical Note Summary</Text>
          <Text style={styles.noteBody}>
            Last check-up on Oct 12: Robert is showing consistent progress with blood pressure management. Advised to continue current Lisinopril dosage. Patient reports no side effects. Next full panel blood work scheduled for Dec 15.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1E293B', borderBottomWidth: 1, borderBottomColor: '#334155' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0ea5e9' },
  scroll: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 24 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 28, color: '#F8FAFC', fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  subtext: { fontSize: 14, color: '#94A3B8' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  primaryBtn: { flex: 2, backgroundColor: '#0ea5e9', padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryBtn: { flex: 1, backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(14, 165, 233, 0.2)' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  gridCard: { width: '48%', backgroundColor: '#1E293B', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155', borderLeftWidth: 4 },
  gridLabel: { fontSize: 12, color: '#94A3B8', fontWeight: 'bold', marginBottom: 8 },
  gridValue: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC' },
  gridUnit: { fontSize: 14, color: '#94A3B8', fontWeight: 'normal' },
  medCardList: { gap: 12, marginBottom: 24 },
  medRow: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  medIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(14, 165, 233, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  medName: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  badge: { backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 4, alignSelf: 'flex-end' },
  badgeText: { color: '#10b981', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  noteCard: { backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(14, 165, 233, 0.2)' },
  noteTitle: { fontSize: 16, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 8 },
  noteBody: { fontSize: 14, color: '#F8FAFC', lineHeight: 22 }
});
