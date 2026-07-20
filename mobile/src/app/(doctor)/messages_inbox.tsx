import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Search, Edit, Home, Heart, FileText, Stethoscope } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

export default function MessagesInbox() {
  const { authenticatedFetch } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await authenticatedFetch('/api/chat/conversations');
        if (res.ok) {
          const data = await res.json();
          setChats(data.map((c: any) => ({
            id: c.appointment_id,
            name: c.name,
            time: 'Just now',
            role: c.role || 'Patient',
            preview: 'Tap to view conversation...',
            unread: 0,
            urgent: false
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [authenticatedFetch]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={{color: '#FFF', fontWeight: 'bold'}}>P</Text>
          </View>
          <Text style={styles.headerTitle}>Ansaea</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Search size={20} color="#94A3B8" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search conversations..."
              placeholderTextColor="#94A3B8"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            <View style={styles.filtersRow}>
              <TouchableOpacity style={styles.filterBtnActive}>
                <Text style={styles.filterTextActive}>All Messages</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn}>
                <Text style={styles.filterText}>Urgent</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn}>
                <Text style={styles.filterText}>Follow-ups</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn}>
                <Text style={styles.filterText}>Staff</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <View style={styles.list}>
          {loading ? (
            <ActivityIndicator size="large" color="#0ea5e9" style={{ marginTop: 20 }} />
          ) : chats.length === 0 ? (
            <Text style={{ color: '#94A3B8', textAlign: 'center', marginTop: 20 }}>No conversations found.</Text>
          ) : (
            chats.map((chat: any) => (
              <TouchableOpacity key={chat.id} style={[styles.chatCard, chat.draft && {opacity: 0.8}]}>
                <View style={styles.avatarContainer}>
                  <View style={styles.chatAvatar}>
                    <Text style={{color: '#0ea5e9', fontWeight: 'bold', fontSize: 18}}>{chat.name?.charAt(chat.name?.startsWith('Dr.') ? 4 : 0)}</Text>
                  </View>
                  {!chat.draft && !chat.urgent && <View style={styles.onlineDot} />}
                </View>
                
                <View style={styles.chatContent}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                    <Text style={[styles.chatTime, chat.draft && {color: '#ef4444'}]}>{chat.time}</Text>
                  </View>
                  
                  <View style={styles.chatBodyRow}>
                    <View style={styles.chatBodyText}>
                      <Text style={[styles.chatRole, chat.draft && {color: '#94A3B8'}]} numberOfLines={1}>{chat.role}</Text>
                      <Text style={[styles.chatPreview, (chat.unread > 0) && {fontWeight: 'bold', color: '#F8FAFC'}, chat.draft && {fontStyle: 'italic'}]} numberOfLines={1}>{chat.preview}</Text>
                    </View>
                    {chat.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{chat.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.fabAdd}>
        <Edit size={24} color="#0F172A" />
      </TouchableOpacity>

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
          <View style={styles.navIconActive}><Stethoscope size={24} color="#FFF" /></View>
          <Text style={[styles.navText, {color: '#FFF'}]}>Consult</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B', backgroundColor: '#0F172A' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#334155' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0ea5e9' },
  
  scroll: { paddingBottom: 100 },
  
  searchSection: { padding: 16, marginBottom: 8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 12, height: 48, paddingHorizontal: 12, marginBottom: 16 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#F8FAFC', fontSize: 16 },
  
  filtersScroll: { marginHorizontal: -16 },
  filtersRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1E293B' },
  filterBtnActive: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#0ea5e9' },
  filterText: { color: '#94A3B8', fontWeight: 'bold', fontSize: 13 },
  filterTextActive: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },

  list: { paddingHorizontal: 16, gap: 12 },
  chatCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, flexDirection: 'row', gap: 16, borderWidth: 1, borderColor: '#334155', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  avatarContainer: { position: 'relative' },
  chatAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(14, 165, 233, 0.1)', alignItems: 'center', justifyContent: 'center' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, backgroundColor: '#10b981', borderRadius: 7, borderWidth: 2, borderColor: '#1E293B' },
  
  chatContent: { flex: 1, justifyContent: 'center' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', flex: 1, marginRight: 8 },
  chatTime: { fontSize: 11, color: '#94A3B8' },
  
  chatBodyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  chatBodyText: { flex: 1, marginRight: 16 },
  chatRole: { fontSize: 13, color: '#0ea5e9', marginBottom: 4 },
  chatPreview: { fontSize: 14, color: '#94A3B8' },
  
  unreadBadge: { backgroundColor: '#0ea5e9', minWidth: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, marginTop: 4 },
  unreadText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  fabAdd: { position: 'absolute', bottom: 90, right: 24, width: 60, height: 60, borderRadius: 24, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#0F172A', borderTopWidth: 1, borderTopColor: '#1E293B', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 16 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navIconActive: { backgroundColor: '#0ea5e9', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, marginBottom: 4 },
  navText: { fontSize: 10, color: '#94A3B8', marginTop: 4 }
});
