import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Video, Calendar, FileText, Shield, Home, Heart, Stethoscope, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

export default function NotificationsCenter() {
  const { authenticatedFetch } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await authenticatedFetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [authenticatedFetch]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn}>
            <ArrowLeft size={24} color="#0ea5e9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.markReadText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Appointments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>APPOINTMENTS</Text>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>2 NEW</Text>
            </View>
          </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0ea5e9" style={{ marginTop: 20 }} />
        ) : notifications.length === 0 ? (
          <Text style={{ color: '#94A3B8', textAlign: 'center', marginTop: 20 }}>No new notifications.</Text>
        ) : (
          notifications.map((notif: any) => (
            <View key={notif.id} style={[styles.card, !notif.read && styles.cardPrimary]}>
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, {backgroundColor: notif.type === 'alert' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(14, 165, 233, 0.2)'}]}>
                  {notif.type === 'alert' ? <Shield size={24} color="#ef4444" /> : <Video size={24} color="#0ea5e9" />}
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle}>{notif.title}</Text>
                    <Text style={styles.timeText}>Just now</Text>
                  </View>
                  <Text style={styles.cardDesc}>{notif.message}</Text>
                  {notif.type === 'appointment' && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={styles.btnPrimary}><Text style={styles.btnPrimaryText}>Join Call</Text></TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
        </View>



      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Home size={24} color="#94A3B8" />
          <Text style={styles.navText}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Heart size={24} color="#94A3B8" />
          <Text style={styles.navText}>Wellness</Text>
        </View>
        <View style={styles.navItem}>
          <FileText size={24} color="#94A3B8" />
          <Text style={styles.navText}>Records</Text>
        </View>
        <View style={styles.navItem}>
          <Stethoscope size={24} color="#94A3B8" />
          <Text style={styles.navText}>Consult</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B', backgroundColor: '#0F172A' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginLeft: 8 },
  markReadText: { color: '#0ea5e9', fontWeight: 'bold', fontSize: 13 },
  
  scroll: { padding: 16, paddingBottom: 100 },
  
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 13, color: '#94A3B8', fontWeight: 'bold', letterSpacing: 1, marginBottom: 12 },
  newBadge: { backgroundColor: 'rgba(14, 165, 233, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  newBadgeText: { color: '#0ea5e9', fontSize: 10, fontWeight: 'bold' },

  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardPrimary: { borderLeftWidth: 4, borderLeftColor: '#0ea5e9' },
  cardRow: { flexDirection: 'row', gap: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  
  cardContent: { flex: 1 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', flex: 1, marginRight: 8 },
  timeText: { fontSize: 12, color: '#94A3B8' },
  cardDesc: { fontSize: 14, color: '#94A3B8', lineHeight: 20 },
  
  actionRow: { flexDirection: 'row', marginTop: 12, gap: 8 },
  btnPrimary: { backgroundColor: '#0ea5e9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  btnPrimaryText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  btnSecondary: { backgroundColor: '#334155', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  btnSecondaryText: { color: '#F8FAFC', fontWeight: 'bold', fontSize: 14 },

  linkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  linkText: { color: '#10b981', fontWeight: 'bold', fontSize: 14, marginRight: 4 },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#0F172A', borderTopWidth: 1, borderTopColor: '#1E293B', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 16 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 10, color: '#94A3B8', marginTop: 4 }
});
