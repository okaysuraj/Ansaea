import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { Search, ChevronRight, Check, X, Calendar as CalendarIcon, Clock, Trash2, Plus, AlertCircle } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

export default function SlotManagement() {
  const { authenticatedFetch } = useAuth();
  const [bufferEnabled, setBufferEnabled] = useState(true);
  const [duration, setDuration] = useState('30');
  
  const [schedule, setSchedule] = useState([
    { day: 'Monday', active: true, mStart: '09:00', mEnd: '13:00', aStart: '14:00', aEnd: '18:00' },
    { day: 'Tuesday', active: true, mStart: '09:00', mEnd: '13:00', aStart: '14:00', aEnd: '18:00' },
    { day: 'Wednesday', active: true, mStart: '08:30', mEnd: '12:00', aStart: '13:00', aEnd: '17:00' },
    { day: 'Thursday', active: false, mStart: '09:00', mEnd: '13:00', aStart: '14:00', aEnd: '18:00' },
    { day: 'Friday', active: true, mStart: '10:00', mEnd: '14:00', aStart: '15:00', aEnd: '19:00' }
  ]);

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].active = !newSchedule[index].active;
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await authenticatedFetch('/api/doctors/slots', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          slots: ['08:00 AM', '13:00 PM'], // Mock visual state representation for now
          auto_buffer_mins: bufferEnabled ? 5 : 0
        })
      });
      if (res.ok) {
        Alert.alert("Success", "Availability configurations saved successfully!");
      } else {
        Alert.alert("Error", "Could not save configurations.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An unexpected error occurred.");
    }
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
        
        <View style={styles.titleSection}>
          <Text style={styles.title}>Slot Management</Text>
          <Text style={styles.subtitle}>Configure your weekly availability, shift ranges, and blocked dates.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Slot Duration</Text>
          <Text style={styles.cardDesc}>Duration per appointment</Text>
          
          <View style={styles.durationRow}>
            {['15', '30', '45', '60'].map(val => (
              <TouchableOpacity 
                key={val} 
                style={[styles.durationBtn, duration === val && styles.durationBtnActive]}
                onPress={() => setDuration(val)}
              >
                <Text style={[styles.durationText, duration === val && styles.durationTextActive]}>{val} min</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Buffer Time</Text>
            <Switch 
              value={bufferEnabled} 
              onValueChange={setBufferEnabled} 
              trackColor={{ false: '#334155', true: '#0ea5e9' }}
              thumbColor="#FFF"
            />
          </View>
          <Text style={styles.cardDesc}>Add 5-min intervals between appointments for notes or transitions.</Text>
          {bufferEnabled && (
            <View style={styles.bufferInfo}>
              <Clock size={16} color="#0ea5e9" />
              <Text style={styles.bufferText}>Enabled: +5 min</Text>
            </View>
          )}
        </View>

        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusTitle}>Live Status</Text>
            <Text style={styles.statusDesc}>Your profile is currently accepting bookings for 32 slots/week.</Text>
          </View>
          <CalendarIcon size={64} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', right: -10, bottom: -10 }} />
        </View>

        <Text style={styles.sectionTitle}>Weekly Availability</Text>

        <View style={styles.scheduleList}>
          {schedule.map((dayConfig, index) => (
            <View key={dayConfig.day} style={[styles.dayCard, !dayConfig.active && styles.dayCardInactive]}>
              <View style={styles.dayHeader}>
                <View style={styles.rowCenter}>
                  <Switch 
                    value={dayConfig.active} 
                    onValueChange={() => toggleDay(index)} 
                    trackColor={{ false: '#334155', true: '#0ea5e9' }}
                    thumbColor="#FFF"
                    style={{ marginRight: 12 }}
                  />
                  <Text style={[styles.dayName, !dayConfig.active && styles.textMuted]}>{dayConfig.day}</Text>
                </View>
              </View>
              
              <View style={styles.shiftsContainer}>
                <View style={[styles.shiftBox, !dayConfig.active && styles.shiftBoxInactive]}>
                  <Text style={styles.shiftLabel}>MORNING</Text>
                  <Text style={styles.shiftTime}>{dayConfig.mStart} — {dayConfig.mEnd}</Text>
                </View>
                <View style={[styles.shiftBox, !dayConfig.active && styles.shiftBoxInactive]}>
                  <Text style={styles.shiftLabel}>AFTERNOON</Text>
                  <Text style={styles.shiftTime}>{dayConfig.aStart} — {dayConfig.aEnd}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.sectionTitle}>Exceptions / Time Off</Text>
            <Text style={styles.subtitle}>Block specific dates or half-days.</Text>
          </View>
          <TouchableOpacity style={styles.btnAdd}>
            <Plus size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.exceptionsList}>
          <View style={[styles.exceptionCard, { borderLeftColor: '#ef4444' }]}>
            <View style={[styles.dateBox, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
              <Text style={[styles.dateMonth, { color: '#ef4444' }]}>OCT</Text>
              <Text style={[styles.dateDay, { color: '#ef4444' }]}>24</Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>Medical Conference</Text>
              <Text style={styles.itemDesc}>All Day • Full Block</Text>
            </View>
            <TouchableOpacity><X size={20} color="#94A3B8" /></TouchableOpacity>
          </View>

          <View style={[styles.exceptionCard, { borderLeftColor: '#8b5cf6' }]}>
            <View style={[styles.dateBox, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
              <Text style={[styles.dateMonth, { color: '#8b5cf6' }]}>NOV</Text>
              <Text style={[styles.dateDay, { color: '#8b5cf6' }]}>02</Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>Early Leave</Text>
              <Text style={styles.itemDesc}>14:00 - 18:00 • Afternoon Block</Text>
            </View>
            <TouchableOpacity><X size={20} color="#94A3B8" /></TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.fabSave} onPress={handleSave}>
        <Check size={28} color="#FFF" />
      </TouchableOpacity>
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
  
  titleSection: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94A3B8' },

  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#94A3B8', marginBottom: 16 },
  
  durationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  durationBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#334155' },
  durationBtnActive: { backgroundColor: '#0ea5e9' },
  durationText: { color: '#94A3B8', fontWeight: 'bold' },
  durationTextActive: { color: '#FFF' },

  bufferInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  bufferText: { color: '#0ea5e9', fontWeight: 'bold', fontSize: 14 },

  statusCard: { backgroundColor: '#0ea5e9', padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', marginBottom: 32 },
  statusTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  statusDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', maxWidth: '90%' },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 16 },
  
  scheduleList: { marginBottom: 32 },
  dayCard: { backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 1, borderColor: '#334155', padding: 16, marginBottom: 12 },
  dayCardInactive: { opacity: 0.6 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  dayName: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  textMuted: { color: '#94A3B8' },
  
  shiftsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  shiftBox: { flex: 1, backgroundColor: '#0F172A', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  shiftBoxInactive: { backgroundColor: '#1E293B' },
  shiftLabel: { fontSize: 10, color: '#94A3B8', fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  shiftTime: { fontSize: 14, fontWeight: 'bold', color: '#0ea5e9' },

  btnAdd: { backgroundColor: '#10b981', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  exceptionsList: { marginTop: 16, marginBottom: 32 },
  exceptionCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#334155', borderLeftWidth: 4, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dateBox: { width: 48, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  dateMonth: { fontSize: 10, fontWeight: 'bold' },
  dateDay: { fontSize: 18, fontWeight: 'bold' },
  itemContent: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 2 },
  itemDesc: { fontSize: 13, color: '#94A3B8' },

  fabSave: { position: 'absolute', bottom: 24, right: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 }
});
