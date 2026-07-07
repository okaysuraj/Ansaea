import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, FileText, Upload } from 'lucide-react-native';
import { router } from 'expo-router';

export default function MedicalRecords() {
  const [records] = useState([
    { id: '1', title: 'Blood Test Results', date: 'Oct 12, 2023', type: 'Lab Report' },
    { id: '2', title: 'Chest X-Ray', date: 'Sep 05, 2023', type: 'Imaging' },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Records</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.uploadBtn}>
          <Upload size={20} color="#fff" />
          <Text style={styles.btnText}>Upload New Record</Text>
        </TouchableOpacity>

        {records.map(record => (
          <View key={record.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <FileText size={24} color="#8B5CF6" />
              <View>
                <Text style={styles.cardTitle}>{record.title}</Text>
                <Text style={styles.cardSub}>{record.type} • {record.date}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View Document</Text>
            </TouchableOpacity>
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
  uploadBtn: { flexDirection: 'row', justifyContent: 'center', gap: 8, backgroundColor: '#8B5CF6', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155', marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC' },
  cardSub: { color: '#94A3B8', fontSize: 12 },
  viewBtn: { backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: 10, borderRadius: 6, alignItems: 'center' },
  viewBtnText: { color: '#8B5CF6', fontWeight: '600' }
});
