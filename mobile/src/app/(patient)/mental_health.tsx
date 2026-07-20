import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Edit3, Smile, Music, Calendar, PlayCircle, Wind } from 'lucide-react-native';
import { useAuth } from '../../../context/AuthContext';

const { width } = Dimensions.get('window');

export default function MentalHealthDashboard() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Good morning, {user?.name || 'Alex'}</Text>
          <Text style={styles.subtitle}>Your sanctuary is ready. How are you feeling in this moment?</Text>
        </View>

        {/* Mood Summary Card */}
        <View style={styles.moodCard}>
          <View style={styles.moodTop}>
            <View>
              <View style={styles.moodBadge}>
                <Text style={styles.moodBadgeText}>MOOD SUMMARY</Text>
              </View>
              <Text style={styles.moodTitle}>Calm & Balanced</Text>
              <Text style={styles.moodDesc}>Your emotional baseline has improved by 12% this week. You've consistently practiced mindfulness for 5 days.</Text>
            </View>
            <View style={styles.moodIconBox}>
              <Smile size={32} color="#0ea5e9" />
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            {[40, 60, 55, 85, 70, 75, 65].map((h, i) => (
              <View key={i} style={[styles.bar, { height: `${h}%`, backgroundColor: h === 85 ? '#0ea5e9' : 'rgba(14, 165, 233, 0.2)' }]} />
            ))}
          </View>
        </View>

        {/* Daily Focus Card */}
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>Daily Focus</Text>
          <Text style={styles.focusDesc}>Box Breathing: 4 seconds in, 4 seconds hold, 4 seconds out.</Text>
          
          <View style={styles.focusCircleContainer}>
            <View style={styles.focusCircleOuter}>
              <View style={styles.focusCircleInner}>
                <Wind size={40} color="#FFF" />
              </View>
            </View>
            <TouchableOpacity style={styles.btnStartSession}>
              <Text style={styles.btnStartSessionText}>Start Session</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem}>
            <View style={[styles.gridIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Edit3 size={24} color="#6366f1" />
            </View>
            <Text style={styles.gridItemText}>Journal Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/mood_check_in')} style={styles.gridItem}>
            <View style={[styles.gridIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Smile size={24} color="#10b981" />
            </View>
            <Text style={styles.gridItemText}>Mood Check-in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <View style={[styles.gridIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
              <Music size={24} color="#a855f7" />
            </View>
            <Text style={styles.gridItemText}>Soundscapes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <View style={[styles.gridIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Calendar size={24} color="#f59e0b" />
            </View>
            <Text style={styles.gridItemText}>Planner</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Insight */}
        <View style={styles.insightImageCard}>
          <View style={styles.insightOverlay}>
            <Text style={styles.insightBadge}>REFLECTION</Text>
            <Text style={styles.insightQuote}>"The soul always knows what to do to heal itself. The challenge is to silence the mind."</Text>
          </View>
        </View>

        {/* Recommended Tracks */}
        <View style={styles.recommendedCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={styles.recTitle}>Recommended Tracks</Text>
            <TouchableOpacity>
              <Text style={styles.recLink}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ gap: 12 }}>
            <TouchableOpacity style={styles.trackItem}>
              <View style={[styles.trackIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
                <Music size={24} color="#6366f1" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.trackName}>Forest Rain</Text>
                <Text style={styles.trackDesc}>15 min • Deep Sleep</Text>
              </View>
              <PlayCircle size={24} color="#0ea5e9" />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.trackItem, { backgroundColor: 'rgba(14, 165, 233, 0.1)', borderLeftWidth: 4, borderLeftColor: '#0ea5e9' }]}>
              <View style={[styles.trackIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Music size={24} color="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.trackName}>Zen Focus</Text>
                <Text style={styles.trackDesc}>10 min • Productivity</Text>
              </View>
              <PlayCircle size={24} color="#0ea5e9" />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scroll: { padding: 16, paddingBottom: 100 },
  
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#94A3B8', lineHeight: 24 },
  
  moodCard: { backgroundColor: '#1E293B', padding: 24, borderRadius: 16, marginBottom: 16 },
  moodTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  moodBadge: { backgroundColor: 'rgba(14, 165, 233, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, marginBottom: 12 },
  moodBadgeText: { color: '#0ea5e9', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  moodTitle: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 8 },
  moodDesc: { fontSize: 14, color: '#94A3B8', lineHeight: 20, maxWidth: '85%' },
  moodIconBox: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(14, 165, 233, 0.1)', alignItems: 'center', justifyContent: 'center' },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 80, gap: 4 },
  bar: { flex: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 },

  focusCard: { backgroundColor: '#0ea5e9', padding: 24, borderRadius: 16, marginBottom: 16 },
  focusTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  focusDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 24 },
  focusCircleContainer: { alignItems: 'center', marginVertical: 16 },
  focusCircleOuter: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  focusCircleInner: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  btnStartSession: { backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 24 },
  btnStartSessionText: { color: '#0ea5e9', fontSize: 14, fontWeight: 'bold' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16 },
  gridItem: { width: (width - 48) / 2, backgroundColor: '#1E293B', padding: 20, borderRadius: 16, alignItems: 'center', gap: 12 },
  gridIconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  gridItemText: { color: '#F8FAFC', fontSize: 14, fontWeight: '500' },

  insightImageCard: { height: 240, borderRadius: 16, overflow: 'hidden', marginBottom: 16, backgroundColor: '#1E293B' },
  insightOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 24, justifyContent: 'flex-end' },
  insightBadge: { color: '#38bdf8', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  insightQuote: { color: '#FFF', fontSize: 18, fontStyle: 'italic', lineHeight: 26 },

  recommendedCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, marginBottom: 24 },
  recTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  recLink: { color: '#0ea5e9', fontSize: 14, fontWeight: '500' },
  trackItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12 },
  trackIconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  trackName: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  trackDesc: { fontSize: 12, color: '#94A3B8' }
});
