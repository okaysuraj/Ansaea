import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, UserCheck, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminApprovals() {
  const [doctors, setDoctors] = useState([
    { id: '1', name: 'Dr. Gregory House', specialty: 'Diagnostic Medicine', license: 'MD-99120', status: 'pending' },
    { id: '2', name: 'Dr. James Wilson', specialty: 'Oncology', license: 'MD-88122', status: 'pending' }
  ]);

  const handleApprove = (id: string) => setDoctors(doctors.filter(d => d.id !== id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Approvals</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {doctors.length === 0 ? (
          <Text style={styles.emptyText}>No pending approvals.</Text>
        ) : doctors.map(doc => (
          <View key={doc.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <UserCheck size={24} color="#0EA5E9" />
              <View>
                <Text style={styles.cardTitle}>{doc.name}</Text>
                <Text style={styles.cardSub}>{doc.specialty}</Text>
              </View>
            </View>
            <Text style={styles.items}>License: {doc.license}</Text>
            
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnReject} onPress={() => handleApprove(doc.id)}>
                <Text style={styles.btnTextReject}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnApprove} onPress={() => handleApprove(doc.id)}>
                <ShieldCheck size={16} color="#fff" />
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>
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
  emptyText: { color: '#94A3B8', textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155', marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC' },
  cardSub: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  items: { color: '#CBD5E1', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 12 },
  btnReject: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  btnTextReject: { color: '#EF4444', fontWeight: '600' },
  btnApprove: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: '600' }
});
