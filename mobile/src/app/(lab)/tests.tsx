import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, ClipboardList, Upload, CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function LabTests() {
  const [tests, setTests] = useState([
    { id: 'LAB-5091', patient: 'Alice Brown', test: 'Complete Blood Count', status: 'pending' },
    { id: 'LAB-5092', patient: 'John Doe', test: 'Lipid Profile', status: 'sample_collected' }
  ]);

  const handleCollect = (id: string) => setTests(tests.map(t => t.id === id ? { ...t, status: 'sample_collected' } : t));
  const handleUpload = (id: string) => setTests(tests.map(t => t.id === id ? { ...t, status: 'completed' } : t));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Requests</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tests.map(test => (
          <View key={test.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <ClipboardList size={24} color="#0EA5E9" />
              <View>
                <Text style={styles.cardTitle}>{test.id}</Text>
                <Text style={styles.cardSub}>{test.patient}</Text>
              </View>
            </View>
            <Text style={styles.items}>{test.test}</Text>
            
            <View style={styles.actions}>
              <View style={[styles.badge, { backgroundColor: test.status === 'pending' ? 'rgba(239, 68, 68, 0.1)' : test.status === 'sample_collected' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(16, 185, 129, 0.1)' }]}>
                <Text style={[styles.badgeText, { color: test.status === 'pending' ? '#EF4444' : test.status === 'sample_collected' ? '#F59E0B' : '#10B981' }]}>
                  {test.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              {test.status === 'pending' && (
                <TouchableOpacity style={styles.btnProcess} onPress={() => handleCollect(test.id)}>
                  <Text style={styles.btnText}>Mark Collected</Text>
                </TouchableOpacity>
              )}
              {test.status === 'sample_collected' && (
                <TouchableOpacity style={styles.btnShip} onPress={() => handleUpload(test.id)}>
                  <Upload size={16} color="#fff" />
                  <Text style={styles.btnText}>Upload Report</Text>
                </TouchableOpacity>
              )}
              {test.status === 'completed' && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={{ color: '#10B981', fontWeight: 'bold' }}>Done</Text>
                </View>
              )}
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC' },
  cardSub: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  items: { color: '#CBD5E1', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  btnProcess: { backgroundColor: '#334155', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  btnShip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: '600' }
});
