import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Search, CloudUpload, FileText, Stethoscope, Pill, Droplet, Calendar, FlaskConical, ChevronRight } from 'lucide-react-native';

export default function MedicalRecords() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Records</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your records..."
            placeholderTextColor="#64748B"
          />
        </View>

        {/* Upload Card */}
        <TouchableOpacity style={styles.uploadCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.uploadTitle}>Upload New</Text>
            <Text style={styles.uploadDesc}>Add lab results or imaging</Text>
          </View>
          <View style={styles.uploadIconBox}>
            <CloudUpload size={28} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Pinned Records */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pinned Records</Text>
            <TouchableOpacity><Text style={styles.sectionLink}>Edit</Text></TouchableOpacity>
          </View>
          
          <View style={styles.pinnedGrid}>
            <TouchableOpacity style={[styles.pinnedCard, styles.pinnedFull]}>
              <View style={styles.pinnedTop}>
                <Stethoscope size={24} color="#ef4444" />
                <View style={styles.criticalBadge}><Text style={styles.criticalText}>CRITICAL</Text></View>
              </View>
              <Text style={styles.pinnedTitle}>Emergency Info Card</Text>
              <Text style={styles.pinnedDesc}>Updated 2 days ago</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.pinnedCard}>
              <Pill size={24} color="#10b981" />
              <View style={{ marginTop: 12 }}>
                <Text style={styles.pinnedTitle}>Active Meds</Text>
                <Text style={styles.pinnedDesc}>4 Prescriptions</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.pinnedCard}>
              <Droplet size={24} color="#6366f1" />
              <View style={{ marginTop: 12 }}>
                <Text style={styles.pinnedTitle}>Blood Panel</Text>
                <Text style={styles.pinnedDesc}>Oct 12, 2023</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Records */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Records</Text>
            <TouchableOpacity><Text style={styles.sectionLink}>View All</Text></TouchableOpacity>
          </View>

          <View style={styles.recentList}>
            <TouchableOpacity style={styles.recentItem}>
              <View style={styles.recentIconBox}>
                <FileText size={24} color="#0ea5e9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.recentTitle}>Annual Physical Report</Text>
                <Text style={styles.recentDesc}>Dr. Sarah Jenkins • Oct 28</Text>
              </View>
              <ChevronRight size={20} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.recentItem}>
              <View style={styles.recentIconBox}>
                <FlaskConical size={24} color="#0ea5e9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.recentTitle}>Metabolic Panel Results</Text>
                <Text style={styles.recentDesc}>City Health Labs • Oct 25</Text>
              </View>
              <ChevronRight size={20} color="#64748B" />
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
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  scroll: { padding: 16, paddingBottom: 100 },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 12, marginBottom: 24 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 48, color: '#F8FAFC', fontSize: 16 },

  uploadCard: { backgroundColor: '#0ea5e9', borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  uploadTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  uploadDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  uploadIconBox: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  sectionLink: { fontSize: 14, color: '#0ea5e9', fontWeight: 'bold' },

  pinnedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  pinnedCard: { width: '48%', backgroundColor: '#1E293B', borderRadius: 16, padding: 16, justifyContent: 'space-between', height: 120, borderWidth: 1, borderColor: '#334155' },
  pinnedFull: { width: '100%', height: 100 },
  pinnedTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  criticalBadge: { backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  criticalText: { color: '#ef4444', fontSize: 10, fontWeight: 'bold' },
  pinnedTitle: { fontSize: 14, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  pinnedDesc: { fontSize: 12, color: '#94A3B8' },

  recentList: { gap: 12 },
  recentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, gap: 16 },
  recentIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(14, 165, 233, 0.1)', alignItems: 'center', justifyContent: 'center' },
  recentTitle: { fontSize: 14, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  recentDesc: { fontSize: 12, color: '#94A3B8' }
});
