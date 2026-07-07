import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ArrowLeft, Stethoscope, Plus, Send } from 'lucide-react-native';
import { router } from 'expo-router';

export default function EPrescription() {
  const [meds, setMeds] = useState([{ name: '', dosage: '', frequency: '' }]);
  const [loading, setLoading] = useState(false);

  const addMed = () => {
    setMeds([...meds, { name: '', dosage: '', frequency: '' }]);
  };

  const updateMed = (index: number, field: 'name' | 'dosage' | 'frequency', value: string) => {
    const newMeds = [...meds];
    newMeds[index][field] = value;
    setMeds(newMeds);
  };

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Prescription sent to pharmacy securely.');
      router.back();
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Prescription</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Stethoscope size={32} color="#10B981" />
          </View>
          <Text style={styles.cardTitle}>Build Prescription</Text>

          {meds.map((med, index) => (
            <View key={index} style={styles.medBox}>
              <Text style={styles.medTitle}>Medication {index + 1}</Text>
              
              <Text style={styles.label}>Name</Text>
              <TextInput style={styles.input} placeholder="e.g. Amoxicillin" placeholderTextColor="#64748B" value={med.name} onChangeText={(t) => updateMed(index, 'name', t)} />
              
              <Text style={styles.label}>Dosage</Text>
              <TextInput style={styles.input} placeholder="e.g. 500mg" placeholderTextColor="#64748B" value={med.dosage} onChangeText={(t) => updateMed(index, 'dosage', t)} />
              
              <Text style={styles.label}>Frequency</Text>
              <TextInput style={styles.input} placeholder="e.g. Twice a day" placeholderTextColor="#64748B" value={med.frequency} onChangeText={(t) => updateMed(index, 'frequency', t)} />
            </View>
          ))}

          <TouchableOpacity style={styles.addBtn} onPress={addMed}>
            <Plus size={20} color="#0EA5E9" />
            <Text style={styles.addBtnText}>Add Another Medication</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={handleSend} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Send size={20} color="#fff" />
                <Text style={styles.btnText}>Send to Pharmacy</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
  card: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  iconContainer: { alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', textAlign: 'center', marginBottom: 24 },
  medBox: { backgroundColor: '#0F172A', padding: 16, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  medTitle: { color: '#94A3B8', fontWeight: 'bold', marginBottom: 12 },
  label: { color: '#CBD5E1', fontSize: 14, marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', borderRadius: 8,
    padding: 12, color: '#F8FAFC', marginBottom: 12, fontSize: 16,
  },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, marginBottom: 24 },
  addBtnText: { color: '#0EA5E9', fontWeight: '600' },
  btn: { flexDirection: 'row', justifyContent: 'center', gap: 8, backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
