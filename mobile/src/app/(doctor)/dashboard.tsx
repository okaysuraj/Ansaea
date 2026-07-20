import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Search, Play, User, ChevronRight, Activity, ActivityIcon, TestTube2, AlertCircle } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

export default function DoctorDashboard() {
  const { user, authenticatedFetch } = useAuth();
  const [timeLeft, setTimeLeft] = useState(299);
  
  const [stats, setStats] = useState({
    consults: 0,
    reports: 0,
    messages: 0,
    today_consults: 0,
  });
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await authenticatedFetch('/api/doctors/dashboard-stats');
        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
        const apptRes = await authenticatedFetch('/api/doctors/appointments/today');
        if (apptRes.ok) {
          setAppointments(await apptRes.json());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authenticatedFetch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={{color: '#FFF', fontWeight: 'bold'}}>Dr</Text>
          </View>
          <Text style={styles.headerTitle}>MedPro Central</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Search size={24} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Good Morning, {(user as any)?.name || 'Doctor'}</Text>
          <Text style={styles.welcomeSubtitle}>You have {stats.today_consults} consultations scheduled for today.</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#0ea5e9' }]}>{stats.consults}</Text>
            <Text style={styles.statLabel}>CONSULTS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#8b5cf6' }]}>{stats.reports}</Text>
            <Text style={styles.statLabel}>REPORTS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#10b981' }]}>{stats.messages}</Text>
            <Text style={styles.statLabel}>MESSAGES</Text>
          </View>
        </View>

        {appointments.length > 0 && (
          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View>
                <View style={styles.badge}><Text style={styles.badgeText}>NEXT PATIENT</Text></View>
                <Text style={styles.heroName}>{appointments[0].patient_name}</Text>
                <Text style={styles.heroDesc}>{appointments[0].reason}</Text>
              </View>
            <View style={styles.timerBox}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timerLabel}>Starts in</Text>
            </View>
            </View>
            
            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.startBtn} onPress={() => router.push(`/consultation_workspace?patientId=${appointments[0].patient_id}`)}>
                <Play size={20} color="#0ea5e9" fill="#0ea5e9" />
                <Text style={styles.startBtnText}>Start Session</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileBtn}>
                <User size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity><Text style={styles.linkText}>View All</Text></TouchableOpacity>
          </View>

          <View style={styles.listCard}>
            {loading ? (
              <ActivityIndicator size="small" color="#0ea5e9" style={{ margin: 20 }} />
            ) : appointments.length === 0 ? (
              <Text style={{ color: '#94A3B8', padding: 16 }}>No appointments today.</Text>
            ) : (
              appointments.map((appt: any, i: number) => {
                const date = new Date(appt.date);
                let hours = date.getHours();
                const minutes = date.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; 
                const timeStr = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
                
                return (
                  <TouchableOpacity key={appt.id} style={styles.listItem} onPress={() => router.push(`/consultation_workspace?patientId=${appt.patient_id}`)}>
                    <View style={styles.timeBox}>
                      <Text style={styles.timeVal}>{timeStr}</Text>
                      <Text style={styles.timeAmPm}>{ampm}</Text>
                    </View>
                    <View style={styles.itemContent}>
                      <Text style={styles.itemName}>{appt.patient_name}</Text>
                      <Text style={styles.itemDesc}>{appt.reason}</Text>
                    </View>
                    <ChevronRight size={20} color="#94A3B8" />
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lab Results</Text>
            <View style={styles.newBadge}><Text style={styles.newBadgeText}>4 New</Text></View>
          </View>

          <View style={styles.listCard}>
            <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0, paddingVertical: 12 }]}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                <ActivityIcon size={20} color="#8b5cf6" />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>David Miller</Text>
                <Text style={styles.itemDesc}>Comprehensive Metabolic Panel</Text>
              </View>
              <AlertCircle size={20} color="#ef4444" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0, paddingVertical: 12 }]}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(14, 165, 233, 0.2)' }]}>
                <TestTube2 size={20} color="#0ea5e9" />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>Emma Wilson</Text>
                <Text style={styles.itemDesc}>Lipid Profile</Text>
              </View>
              <Text style={{color: '#10b981', fontWeight: 'bold', fontSize: 12}}>Normal</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0ea5e9' },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  
  scroll: { padding: 16, paddingBottom: 100 },
  
  welcomeSection: { marginBottom: 24 },
  welcomeTitle: { fontSize: 28, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  welcomeSubtitle: { fontSize: 16, color: '#94A3B8' },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#1E293B', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  statValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: 'bold' },

  heroCard: { backgroundColor: '#0ea5e9', borderRadius: 24, padding: 24, marginBottom: 24 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, alignSelf: 'flex-start', marginBottom: 12 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  heroName: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  heroDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  timerBox: { alignItems: 'flex-end' },
  timerText: { fontSize: 20, fontWeight: 'bold', color: '#FFF', fontFamily: 'monospace' },
  timerLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  
  heroActions: { flexDirection: 'row', gap: 12 },
  startBtn: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  startBtnText: { color: '#0ea5e9', fontWeight: 'bold', fontSize: 16 },
  profileBtn: { width: 52, height: 52, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  linkText: { color: '#0ea5e9', fontWeight: 'bold' },
  newBadge: { backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  newBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  listCard: { backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 1, borderColor: '#334155', overflow: 'hidden' },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
  timeBox: { width: 48, alignItems: 'center' },
  timeVal: { fontSize: 14, fontWeight: 'bold', color: '#F8FAFC' },
  timeAmPm: { fontSize: 10, color: '#94A3B8', fontWeight: 'bold' },
  itemContent: { flex: 1, paddingHorizontal: 12 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 2 },
  itemDesc: { fontSize: 13, color: '#94A3B8' },

  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }
});
