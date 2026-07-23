import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../../context/AuthContext';

const MOODS = [
  { id: 'great', emoji: '✨', label: 'Great' },
  { id: 'good', emoji: '😊', label: 'Good' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'low', emoji: '😔', label: 'Low' },
  { id: 'distressed', emoji: '😫', label: 'Distressed' }
];

const INFLUENCES = ['Sleep', 'Work', 'Social', 'Family', 'Health', 'Diet', 'Exercise'];

export default function MoodCheckIn() {
  const { authenticatedFetch } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    setSubmitting(true);
    try {
      const res = await authenticatedFetch('/api/patients/wearable-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data_type: 'mood',
          measurement_value: selectedMood,
          unit: 'category',
          notes: JSON.stringify({ tags: selectedTags, note })
        })
      });
      if (res.ok) {
        router.back();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood Check-In</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.introSection}>
          <Text style={styles.title}>How are you today?</Text>
          <Text style={styles.subtitle}>Take a moment to check in with yourself. Your journey to wellness starts with awareness.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select your current mood</Text>
          <View style={styles.moodGrid}>
            {MOODS.map(m => (
              <TouchableOpacity 
                key={m.id} 
                onPress={() => setSelectedMood(m.id)}
                style={[styles.moodItem, selectedMood === m.id && styles.moodItemActive]}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, selectedMood === m.id && styles.moodLabelActive]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeading}>WHAT'S INFLUENCING YOU?</Text>
          <View style={styles.tagsContainer}>
            {INFLUENCES.map(t => (
              <TouchableOpacity 
                key={t}
                onPress={() => toggleTag(t)}
                style={[styles.tag, selectedTags.includes(t) && styles.tagActive]}
              >
                <Text style={[styles.tagText, selectedTags.includes(t) && styles.tagTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeading}>WHAT'S ON YOUR MIND?</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Optional: Journal your thoughts..."
            placeholderTextColor="#64748B"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity 
          style={[styles.btnSubmit, (!selectedMood || submitting) && styles.btnSubmitDisabled]}
          onPress={handleSubmit}
          disabled={!selectedMood || submitting}
        >
          <Text style={styles.btnSubmitText}>{submitting ? 'Logging...' : 'Log Check-In'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  scroll: { padding: 16, paddingBottom: 100 },
  
  introSection: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#94A3B8', lineHeight: 24 },

  card: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 16 },
  
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  moodItem: { width: '30%', backgroundColor: '#0F172A', padding: 16, borderRadius: 12, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#334155' },
  moodItemActive: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  moodEmoji: { fontSize: 32 },
  moodLabel: { fontSize: 12, color: '#F8FAFC', fontWeight: '500' },
  moodLabelActive: { color: '#FFF' },

  sectionHeading: { fontSize: 12, fontWeight: 'bold', color: '#0ea5e9', letterSpacing: 1, marginBottom: 16 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155' },
  tagActive: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  tagText: { color: '#F8FAFC', fontSize: 14, fontWeight: '500' },
  tagTextActive: { color: '#FFF' },

  textArea: { backgroundColor: '#0F172A', color: '#F8FAFC', padding: 16, borderRadius: 12, minHeight: 120, textAlignVertical: 'top', fontSize: 16 },

  btnSubmit: { backgroundColor: '#0ea5e9', paddingVertical: 16, borderRadius: 32, alignItems: 'center', marginTop: 16 },
  btnSubmitDisabled: { opacity: 0.5 },
  btnSubmitText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
