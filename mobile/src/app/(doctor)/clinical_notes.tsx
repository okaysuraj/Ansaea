import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { FileSignature, ArrowLeft, Bot, Save } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function ClinicalNotes() {
  const { authenticatedFetch } = useAuth();
  const { appointmentId } = useLocalSearchParams();
  const [note, setNote] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (!appointmentId) return;
    const fetchNote = async () => {
      try {
        const res = await authenticatedFetch(`/api/doctors/notes/${appointmentId}`);
        if (res.ok) {
          const d = await res.json();
          if (d.data) setNote(d.data);
        }
      } catch (e) { console.error(e); }
    };
    fetchNote();
  }, [appointmentId, authenticatedFetch]);

  const generateAIAssistedNote = async () => {
    setLoading(true);
    try {
      const res = await authenticatedFetch('/api/ai/generate-note', {
        method: 'POST',
        body: JSON.stringify({ transcript: "Placeholder transcript from visit..." })
      });
      if (res.ok) {
        const data = await res.json();
        setNote({
          subjective: data.subjective,
          objective: data.objective,
          assessment: data.assessment,
          plan: data.plan
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!appointmentId) {
      alert("No appointment context available for demo.");
      router.back();
      return;
    }
    setSaving(true);
    try {
      const res = await authenticatedFetch(`/api/doctors/notes/${appointmentId}`, {
        method: 'POST',
        body: JSON.stringify(note)
      });
      if (res.ok) {
        alert('Note saved securely.');
        router.back();
      }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clinical Notes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <FileSignature size={32} color="#F59E0B" />
          </View>
          <Text style={styles.cardTitle}>SOAP Note Editor</Text>

          <TouchableOpacity style={styles.aiBtn} onPress={generateAIAssistedNote} disabled={loading}>
            {loading ? <ActivityIndicator color="#F59E0B" /> : (
              <>
                <Bot size={20} color="#F59E0B" />
                <Text style={styles.aiBtnText}>Auto-Generate from Transcript</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Subjective</Text>
          <TextInput
            style={styles.input}
            placeholder="Patient reports..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={3}
            value={note.subjective}
            onChangeText={t => setNote({...note, subjective: t})}
          />

          <Text style={styles.label}>Objective</Text>
          <TextInput
            style={styles.input}
            placeholder="Vitals, physical exam..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={3}
            value={note.objective}
            onChangeText={t => setNote({...note, objective: t})}
          />

          <Text style={styles.label}>Assessment</Text>
          <TextInput
            style={styles.input}
            placeholder="Diagnosis..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={2}
            value={note.assessment}
            onChangeText={t => setNote({...note, assessment: t})}
          />

          <Text style={styles.label}>Plan</Text>
          <TextInput
            style={styles.input}
            placeholder="Treatment, follow-up..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={3}
            value={note.plan}
            onChangeText={t => setNote({...note, plan: t})}
          />

          <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : (
              <>
                <Save size={20} color="#fff" />
                <Text style={styles.btnText}>Save Note</Text>
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
  label: { color: '#CBD5E1', fontSize: 14, marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155', borderRadius: 8,
    padding: 12, color: '#F8FAFC', marginBottom: 20, fontSize: 16, textAlignVertical: 'top', minHeight: 80
  },
  aiBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, 
    backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 12, borderRadius: 8, marginBottom: 24,
    borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)' 
  },
  aiBtnText: { color: '#F59E0B', fontWeight: '600' },
  btn: { flexDirection: 'row', justifyContent: 'center', gap: 8, backgroundColor: '#F59E0B', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
