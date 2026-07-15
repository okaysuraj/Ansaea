import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Activity, ArrowLeft, AlertTriangle, Info } from 'lucide-react-native';
import { router } from 'expo-router';

interface TriageResult {
  triage_level: 'URGENT' | 'ROUTINE' | 'NORMAL';
  recommendation: string;
  possible_conditions: string[];
}

export default function SymptomChecker() {
  const { authenticatedFetch } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await authenticatedFetch('/api/ai/triage', {
        method: 'POST',
        body: JSON.stringify({ symptoms })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Symptom Checker</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Activity size={32} color="#10B981" />
          </View>
          <Text style={styles.cardTitle}>How are you feeling?</Text>
          <Text style={styles.cardDesc}>Describe your symptoms in your own words. Our AI will analyze them and suggest the next steps.</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g., I've had a severe headache and nausea since yesterday..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={4}
            value={symptoms}
            onChangeText={setSymptoms}
          />

          <TouchableOpacity style={styles.btn} onPress={handleAnalyze} disabled={loading || !symptoms.trim()}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Analyze Symptoms</Text>}
          </TouchableOpacity>
        </View>

        {result && (
          <View style={[styles.resultCard, { borderColor: result.triage_level === 'URGENT' ? '#EF4444' : result.triage_level === 'ROUTINE' ? '#F59E0B' : '#10B981' }]}>
            <View style={styles.resultHeader}>
              {result.triage_level === 'URGENT' ? <AlertTriangle size={20} color="#EF4444" /> : <Info size={20} color="#10B981" />}
              <Text style={[styles.triageLevel, { color: result.triage_level === 'URGENT' ? '#EF4444' : result.triage_level === 'ROUTINE' ? '#F59E0B' : '#10B981' }]}>
                {result.triage_level}
              </Text>
            </View>
            <Text style={styles.recommendation}>{result.recommendation}</Text>
            <View style={styles.conditionsBox}>
              <Text style={styles.conditionsLabel}>Possible indications:</Text>
              {result.possible_conditions.map((cond: string, i: number) => (
                <Text key={i} style={styles.conditionItem}>• {cond}</Text>
              ))}
            </View>
          </View>
        )}
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
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', textAlign: 'center', marginBottom: 8 },
  cardDesc: { color: '#94A3B8', fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  input: {
    backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155', borderRadius: 8,
    padding: 16, color: '#F8FAFC', marginBottom: 20, fontSize: 16, textAlignVertical: 'top', minHeight: 120
  },
  btn: { backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  
  resultCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, borderWidth: 2, marginTop: 20 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  triageLevel: { fontSize: 16, fontWeight: 'bold' },
  recommendation: { color: '#F8FAFC', fontSize: 15, lineHeight: 22, marginBottom: 16 },
  conditionsBox: { backgroundColor: '#0F172A', padding: 12, borderRadius: 8 },
  conditionsLabel: { color: '#94A3B8', fontWeight: '600', marginBottom: 8, fontSize: 12 },
  conditionItem: { color: '#CBD5E1', fontSize: 14, marginBottom: 4 }
});
