import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Users, Calendar, Stethoscope, FileSignature } from 'lucide-react-native';
import { router } from 'expo-router';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Doctor Dashboard</Text>
          <Text style={styles.username}>Dr. {user?.username}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <LogOut size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Upcoming</Text>
            <Text style={styles.statValue}>4</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Patients</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Users size={24} color="#0EA5E9" />
            <Text style={styles.cardTitle}>Patient Roster</Text>
          </View>
          <Text style={styles.cardDesc}>View your active patients and their recent vitals.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.push('/(doctor)/roster')}>
            <Text style={styles.btnText}>View Patients</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FileSignature size={24} color="#F59E0B" />
            <Text style={styles.cardTitle}>Clinical Notes</Text>
          </View>
          <Text style={styles.cardDesc}>Write SOAP notes or auto-generate them using AI.</Text>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#F59E0B' }]} onPress={() => router.push('/(doctor)/clinical_notes')}>
            <Text style={styles.btnText}>Write Note</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Stethoscope size={24} color="#10B981" />
            <Text style={styles.cardTitle}>E-Prescriptions</Text>
          </View>
          <Text style={styles.cardDesc}>Prescribe medications directly to the pharmacy.</Text>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#10B981' }]} onPress={() => router.push('/(doctor)/eprescription')}>
            <Text style={styles.btnText}>New Prescription</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  greeting: {
    color: '#94A3B8',
    fontSize: 14,
  },
  username: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  cardDesc: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  btn: {
    backgroundColor: '#0EA5E9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  }
});
