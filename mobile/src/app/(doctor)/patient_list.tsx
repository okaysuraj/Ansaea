import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Search, SlidersHorizontal, ChevronRight, Calendar, MessageSquare, History, FileText, Plus } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

export default function PatientList() {
  const { authenticatedFetch } = useAuth();
  const [activeFilter, setActiveFilter] = useState('Assigned to Me');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await authenticatedFetch('/api/doctors/patients');
        if (res.ok) {
          const data = await res.json();
          setPatients(data.map((p: any) => ({
            id: `#PT-${p.id.substring(0, 4).toUpperCase()}`,
            name: p.name,
            age: 45, // default
            gender: 'Unknown',
            status: p.status || 'Stable',
            statusColor: '#10b981', // green default
            lastVisit: 'Unknown',
            detailLabel: 'Email',
            detailValue: p.email,
            nextAction: 'View Details',
            actionIcon: FileText,
            patientId: p.id
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [authenticatedFetch]);



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

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search patients by name or ID..."
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity style={styles.filterIcon}>
            <SlidersHorizontal size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {['Assigned to Me', 'All Patients'].map(filter => (
            <TouchableOpacity 
              key={filter} 
              style={[styles.filterBtn, activeFilter === filter && styles.filterBtnActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0ea5e9" style={{ marginTop: 20 }} />
        ) : patients.length === 0 ? (
          <Text style={{ color: '#94A3B8', textAlign: 'center', marginTop: 20 }}>No patients found.</Text>
        ) : (
          patients.map((patient: any, i: number) => (
            <TouchableOpacity key={i} style={styles.patientCard} onPress={() => router.push(`/consultation_workspace?patientId=${patient.patientId}`)}>
            
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientSub}>{patient.age} yrs • {patient.gender} • ID: {patient.id}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${patient.statusColor}20` }]}>
                <Text style={[styles.statusText, { color: patient.statusColor }]}>{patient.status}</Text>
              </View>
            </View>

            <View style={styles.cardMiddle}>
              <View style={styles.middleCol}>
                <Text style={styles.middleLabel}>LAST VISIT</Text>
                <Text style={styles.middleVal}>{patient.lastVisit}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.middleCol}>
                <Text style={styles.middleLabel}>{patient.detailLabel.toUpperCase()}</Text>
                <Text style={[styles.middleVal, patient.detailValueColor && { color: patient.detailValueColor }]}>{patient.detailValue}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.footerLeft}>
                <patient.actionIcon size={16} color="#94A3B8" />
                <Text style={styles.footerText}>{patient.nextAction}</Text>
              </View>
              <View style={styles.footerRight}>
                <Text style={styles.actionText}>{patient.status === 'Needs Review' ? 'Take Action' : 'View Records'}</Text>
                <ChevronRight size={16} color="#0ea5e9" />
              </View>
            </View>

          </TouchableOpacity>
        )))}

      </ScrollView>

      <TouchableOpacity style={styles.fabAdd}>
        <Plus size={28} color="#FFF" />
      </TouchableOpacity>
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
  
  searchSection: { padding: 16, backgroundColor: '#0F172A', zIndex: 10 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 12, height: 48, paddingHorizontal: 12, marginBottom: 16 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#F8FAFC', fontSize: 16 },
  filterIcon: { padding: 4 },
  
  filterRow: { flexDirection: 'row', gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1E293B' },
  filterBtnActive: { backgroundColor: '#0ea5e9' },
  filterText: { color: '#94A3B8', fontWeight: 'bold', fontSize: 13 },
  filterTextActive: { color: '#FFF' },

  scroll: { padding: 16, paddingBottom: 100 },
  
  patientCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  patientName: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 2 },
  patientSub: { fontSize: 13, color: '#94A3B8' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },

  cardMiddle: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#334155', paddingVertical: 12, marginBottom: 12 },
  middleCol: { flex: 1 },
  divider: { width: 1, backgroundColor: '#334155', marginHorizontal: 16 },
  middleLabel: { fontSize: 10, color: '#94A3B8', fontWeight: 'bold', marginBottom: 4 },
  middleVal: { fontSize: 14, color: '#F8FAFC', fontWeight: 'bold' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 13, color: '#94A3B8' },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 13, color: '#0ea5e9', fontWeight: 'bold' },

  fabAdd: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 }
});
