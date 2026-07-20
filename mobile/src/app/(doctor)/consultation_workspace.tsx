import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Settings, Mic, Video, PhoneOff, AlertTriangle, Heart, Activity, Wind, FileText, ChevronRight, Plus, Calendar, History, Pill, MoreHorizontal } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

export default function ConsultationWorkspace() {
  const { authenticatedFetch } = useAuth();
  const { patientId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('vitals');
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    const fetchPatient = async () => {
      try {
        const res = await authenticatedFetch(`/api/doctors/patients/${patientId}/history`);
        if (res.ok) {
          const data = await res.json();
          setPatient({
            name: data.profile.name || 'Unknown',
            age: data.profile.dob ? new Date().getFullYear() - new Date(data.profile.dob).getFullYear() : '--',
            history: data.history.past_surgeries,
            medications: data.history.chronic_conditions
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientId, authenticatedFetch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={{color: '#FFF', fontWeight: 'bold'}}>AS</Text>
          </View>
          <Text style={styles.headerTitle}>Clinical Toolkit</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Settings size={24} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.videoSection}>
          <View style={styles.videoPlaceholder}>
            <Text style={{color: 'rgba(255,255,255,0.2)'}}>Video Stream</Text>
          </View>
          
          <View style={styles.videoOverlayTop}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE 12:44</Text>
            </View>
          </View>

          <View style={styles.videoControls}>
            <TouchableOpacity style={styles.controlBtn}><Mic size={20} color="#FFF" /></TouchableOpacity>
            <TouchableOpacity style={styles.controlBtn}><Video size={20} color="#FFF" /></TouchableOpacity>
            <TouchableOpacity style={[styles.controlBtn, {backgroundColor: '#ef4444'}]}><PhoneOff size={20} color="#FFF" /></TouchableOpacity>
          </View>
        </View>

        <View style={styles.patientInfoBar}>
          <View>
            <Text style={styles.patientName}>{patient?.name || 'Patient'}, {patient?.age || '--'}</Text>
            <View style={styles.rowCenter}>
              <AlertTriangle size={14} color="#94A3B8" style={{marginRight: 4}} />
              <Text style={styles.patientSub}>Chief Complaint: Chronic Lower Back Pain</Text>
            </View>
          </View>
          <View style={styles.sessionBadge}>
            <Text style={styles.sessionText}>In Session</Text>
          </View>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'vitals' && styles.tabActive]}
            onPress={() => setActiveTab('vitals')}
          >
            <Text style={[styles.tabText, activeTab === 'vitals' && styles.tabTextActive]}>Real-time Vitals</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'history' && styles.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>Quick History</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'notes' && styles.tabActive]}
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[styles.tabText, activeTab === 'notes' && styles.tabTextActive]}>Active Notes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContent}>
          
          {activeTab === 'vitals' && (
            <View>
              <View style={styles.vitalsGrid}>
                <View style={styles.vitalCard}>
                  <View style={styles.rowBetween}>
                    <Heart size={20} color="#ef4444" />
                    <Text style={styles.vitalLabel}>BPM</Text>
                  </View>
                  <View style={styles.vitalValRow}>
                    <Text style={styles.vitalVal}>78</Text>
                    <Text style={[styles.vitalSub, {color: '#10b981'}]}>Normal</Text>
                  </View>
                </View>
                
                <View style={styles.vitalCard}>
                  <View style={styles.rowBetween}>
                    <Activity size={20} color="#0ea5e9" />
                    <Text style={styles.vitalLabel}>SYS/DIA</Text>
                  </View>
                  <View style={styles.vitalValRow}>
                    <Text style={styles.vitalVal}>118/76</Text>
                  </View>
                  <View style={styles.rowCenter}>
                    <View style={[styles.dot, {backgroundColor: '#10b981'}]} />
                    <Text style={[styles.vitalSub, {color: '#10b981'}]}>Optimal</Text>
                  </View>
                </View>
              </View>

              <View style={styles.vitalRowCard}>
                <View style={styles.rowBetween}>
                  <View style={styles.rowCenter}>
                    <Wind size={20} color="#8b5cf6" style={{marginRight: 8}} />
                    <Text style={styles.vitalLabelBig}>SpO2 Saturation</Text>
                  </View>
                  <Text style={styles.vitalValBig}>99%</Text>
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, {width: '99%', backgroundColor: '#8b5cf6'}]} />
                </View>
              </View>
            </View>
          )}

          {activeTab === 'history' && (
            <View>
              <View style={styles.historyCard}>
                <Text style={styles.historyTitle}>Past Conditions & Surgeries</Text>
                
                {patient?.history?.length === 0 && <Text style={{color: '#94A3B8'}}>No history found.</Text>}
                {patient?.history?.map((item: any, idx: number) => (
                  <View key={idx} style={styles.historyItem}>
                    <View style={styles.historyIconBox}><History size={20} color="#94A3B8" /></View>
                    <View>
                      <Text style={styles.historyDate}>{item}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.historyCard}>
                <Text style={styles.historyTitle}>Known Allergies</Text>
                <View style={styles.tagsRow}>
                  <View style={styles.tagRed}><Text style={styles.tagRedText}>Penicillin</Text></View>
                  <View style={styles.tagGray}><Text style={styles.tagGrayText}>Latex</Text></View>
                  <View style={styles.tagGray}><Text style={styles.tagGrayText}>Tree Nuts</Text></View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'notes' && (
            <View>
              <View style={styles.notesCard}>
                <View style={styles.notesHeader}>
                  <Text style={styles.notesTitle}>AI-Assisted Transcription</Text>
                  <View style={[styles.liveDot, {backgroundColor: '#10b981'}]} />
                </View>
                <View style={styles.notesBody}>
                  <Text style={styles.notesText}>"Patient reports pain radiates down left leg... aggravated by sitting... relieved by lying flat..."</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Medications / Scripts</Text>
              
              {patient?.medications?.length === 0 && <Text style={{color: '#94A3B8'}}>No active medications.</Text>}
              {patient?.medications?.map((item: any, idx: number) => (
                <View key={idx} style={[styles.rxCard, {marginBottom: 12}]}>
                  <View style={styles.rowCenter}>
                    <Pill size={24} color="#0ea5e9" style={{marginRight: 12}} />
                    <View>
                      <Text style={styles.rxName}>{item}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

        </View>

      </ScrollView>

      <TouchableOpacity style={styles.fabAdd}>
        <Plus size={24} color="#FFF" />
        <Text style={styles.fabText}>Add Quick Note</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <View style={styles.navIconActive}><Video size={20} color="#FFF" /></View>
          <Text style={styles.navText}>Consult</Text>
        </View>
        <View style={styles.navItem}>
          <FileText size={20} color="#94A3B8" />
          <Text style={styles.navText}>Notes</Text>
        </View>
        <View style={styles.navItem}>
          <Activity size={20} color="#94A3B8" />
          <Text style={styles.navText}>Diagnosis</Text>
        </View>
        <View style={styles.navItem}>
          <Pill size={20} color="#94A3B8" />
          <Text style={styles.navText}>Scripts</Text>
        </View>
        <View style={styles.navItem}>
          <MoreHorizontal size={20} color="#94A3B8" />
          <Text style={styles.navText}>More</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B', backgroundColor: '#0F172A' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0ea5e9' },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  
  scroll: { paddingBottom: 160 },
  
  videoSection: { height: 240, backgroundColor: '#1E293B', position: 'relative' },
  videoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  videoOverlayTop: { position: 'absolute', top: 16, right: 16 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', marginRight: 6 },
  liveText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  videoControls: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 16 },
  controlBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },

  patientInfoBar: { padding: 16, backgroundColor: '#1E293B', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  patientName: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  patientSub: { fontSize: 12, color: '#94A3B8' },
  sessionBadge: { backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
  sessionText: { color: '#10b981', fontSize: 12, fontWeight: 'bold' },

  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1E293B', backgroundColor: '#0F172A' },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#0ea5e9' },
  tabText: { color: '#94A3B8', fontWeight: 'bold', fontSize: 13 },
  tabTextActive: { color: '#0ea5e9' },

  tabContent: { padding: 16 },
  
  vitalsGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  vitalCard: { flex: 1, backgroundColor: '#1E293B', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vitalLabel: { fontSize: 12, color: '#94A3B8', fontWeight: 'bold' },
  vitalValRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 12, marginBottom: 4 },
  vitalVal: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC' },
  vitalSub: { fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },

  vitalRowCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 12 },
  vitalLabelBig: { fontSize: 14, fontWeight: 'bold', color: '#F8FAFC' },
  vitalValBig: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC' },
  barBg: { height: 8, backgroundColor: '#334155', borderRadius: 4, marginTop: 12, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },

  historyCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  historyTitle: { fontSize: 14, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 16 },
  historyItem: { flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#334155', marginBottom: 12 },
  historyIconBox: { padding: 8, backgroundColor: '#334155', borderRadius: 8, marginRight: 12 },
  historyDate: { fontSize: 14, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  historyDesc: { fontSize: 12, color: '#94A3B8' },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagRed: { backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagRedText: { color: '#ef4444', fontSize: 12, fontWeight: 'bold' },
  tagGray: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagGrayText: { color: '#F8FAFC', fontSize: 12, fontWeight: 'bold' },

  notesCard: { backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 1, borderColor: '#334155', overflow: 'hidden', marginBottom: 24 },
  notesHeader: { backgroundColor: '#334155', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notesTitle: { fontSize: 12, color: '#94A3B8' },
  notesBody: { padding: 16, minHeight: 120 },
  notesText: { fontSize: 14, color: '#F8FAFC', fontStyle: 'italic', lineHeight: 22 },

  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#94A3B8', marginBottom: 8, marginLeft: 4 },
  rxCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rxName: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  rxSub: { fontSize: 12, color: '#94A3B8' },

  fabAdd: { position: 'absolute', bottom: 100, right: 16, backgroundColor: '#0ea5e9', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 56, borderRadius: 28, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  fabText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#0F172A', borderTopWidth: 1, borderTopColor: '#1E293B', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 16 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navIconActive: { backgroundColor: 'rgba(14, 165, 233, 0.2)', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 16, marginBottom: 4 },
  navText: { fontSize: 10, color: '#94A3B8', marginTop: 4 }
});
