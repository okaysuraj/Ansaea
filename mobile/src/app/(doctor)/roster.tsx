import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Users } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PatientRoster() {
  const patients = [
    { id: '1', name: 'John Doe', status: 'Stable', lastSeen: 'Today, 9:00 AM' },
    { id: '2', name: 'Jane Smith', status: 'Needs Review', lastSeen: 'Yesterday' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Roster</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {patients.map(patient => (
          <View key={patient.id} style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{patient.name.substring(0, 2).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{patient.name}</Text>
                <Text style={styles.cardSub}>Last Seen: {patient.lastSeen}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: patient.status === 'Stable' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                <Text style={[styles.badgeText, { color: patient.status === 'Stable' ? '#10B981' : '#EF4444' }]}>{patient.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    padding: 24, paddingTop: 60, backgroundColor: '#1E293B',
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#334155',
  },
  backBtn: { marginRight: 16 },
  headerTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0EA5E9', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC' },
  cardSub: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' }
});
