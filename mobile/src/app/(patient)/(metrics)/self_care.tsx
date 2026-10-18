import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2, Circle, Flame } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../../context/useAuth';

export default function SelfCareTracker() {
  const { authenticatedFetch } = useAuth();
  const [habits, setHabits] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ current_streak: 5, completion_rate: 85 });
  const [loading, setLoading] = useState(true);

  const defaultHabits = [
    { name: 'Mindful Somatic Breathing (5m)', category: 'Nervous System' },
    { name: 'Hydration Target (2.5L)', category: 'Biological' },
    { name: 'Natural Sunlight Exposure (15m)', category: 'Circadian' },
    { name: 'Digital Sunset (No screens 1h before bed)', category: 'Sleep' },
    { name: 'Expressive Journaling / Cognitive Reframe', category: 'Mental' },
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchHabits = async () => {
    try {
      const res = await authenticatedFetch('/api/tracker/habits');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const todayLog = data.find((l: any) => l.date === todayStr);
          if (todayLog && Array.isArray(todayLog.habits)) {
            setHabits(todayLog.habits);
          } else {
            setHabits([]);
          }
        }
      }
      const statRes = await authenticatedFetch('/api/tracker/habits/stats');
      if (statRes.ok) {
        const sData = await statRes.json();
        setStats(sData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [authenticatedFetch]);

  const toggleHabit = async (habitName: string) => {
    const existing = habits.find((h) => h.name === habitName || h.habit_name === habitName);
    const newStatus = existing ? !existing.completed : true;

    const updatedHabits = defaultHabits.map((d) => {
      if (d.name === habitName) {
        return { name: d.name, completed: newStatus };
      }
      const prev = habits.find((h) => h.name === d.name || h.habit_name === d.name);
      return { name: d.name, completed: prev ? prev.completed : false };
    });

    setHabits(updatedHabits);

    try {
      const res = await authenticatedFetch('/api/tracker/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayStr,
          habits: updatedHabits,
        }),
      });
      if (res.ok) fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Self-Care Protocols</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Streak & Score Hero */}
        <View style={styles.heroCard}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <Text style={styles.heroSub}>Active Habit Streak</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <Flame size={28} color="#f59e0b" />
                <Text style={styles.heroVal}>{stats.current_streak || 1} Days</Text>
              </View>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{stats.completion_rate || 80}% Adherence</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Daily Protocols for {todayStr}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0ea5e9" style={{ marginTop: 24 }} />
        ) : (
          <View style={styles.list}>
            {defaultHabits.map((item) => {
              const record = habits.find((h) => h.name === item.name || h.habit_name === item.name);
              const isDone = record ? record.completed : false;

              return (
                <TouchableOpacity
                  key={item.name}
                  style={[styles.habitCard, isDone && styles.habitCardDone]}
                  onPress={() => toggleHabit(item.name)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.categoryBadge}>{item.category}</Text>
                    <Text style={[styles.habitText, isDone && styles.habitTextDone]}>
                      {item.name}
                    </Text>
                  </View>
                  {isDone ? (
                    <CheckCircle2 size={24} color="#10b981" />
                  ) : (
                    <Circle size={24} color="#64748B" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' },
  scroll: { padding: 20 },
  heroCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  heroSub: { color: '#94A3B8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  heroVal: { color: '#F8FAFC', fontSize: 28, fontWeight: 'bold' },
  scoreBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  scoreText: { color: '#f59e0b', fontSize: 13, fontWeight: 'bold' },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  list: { gap: 12 },
  habitCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitCardDone: { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: '#10b981' },
  categoryBadge: {
    color: '#0ea5e9',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  habitText: { color: '#F8FAFC', fontSize: 15, fontWeight: '500' },
  habitTextDone: { textDecorationLine: 'line-through', color: '#94A3B8' },
});
