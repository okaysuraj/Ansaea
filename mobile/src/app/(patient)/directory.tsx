import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Search, Star, Award, DollarSign } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function FindDoctors() {
  const { authenticatedFetch } = useAuth();
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await authenticatedFetch('/api/psychiatrists');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (e) {
      console.log('Error fetching doctors:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (docId, price) => {
    Alert.alert(
      "Confirm Booking",
      `Book consultation for $${price}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Book", 
          onPress: async () => {
            try {
              // Note: using a hardcoded slot for the mobile demo to ensure rapid parity.
              const response = await authenticatedFetch('/api/psychiatrists/book', {
                method: 'POST',
                body: JSON.stringify({
                  doctor_id: docId,
                  date: new Date().toISOString().split('T')[0],
                  time_slot: '10:00 AM',
                  session_type: 'video'
                })
              });
              if (response.ok) {
                Alert.alert("Success", "Appointment Booked!");
              } else {
                const err = await response.json();
                Alert.alert("Booking Failed", err.detail || "Slot not available");
              }
            } catch (e) {
              console.log(e);
            }
          }
        }
      ]
    );
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Specialists</Text>
        <View style={styles.searchBox}>
          <Search size={18} color="#94A3B8" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search by name or specialty..." 
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0ea5e9" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {filteredDoctors.map(doc => (
            <View key={doc.id} style={styles.card}>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <Image source={{ uri: doc.imageUrl }} style={styles.image} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{doc.name}</Text>
                  <Text style={styles.spec}>{doc.specialty}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 }}>
                    <View style={styles.badge}><Star size={12} color="#f59e0b" /><Text style={styles.badgeText}>{doc.rating}</Text></View>
                    <View style={styles.badge}><Award size={12} color="#0ea5e9" /><Text style={styles.badgeText}>{doc.experience_years} Yrs</Text></View>
                  </View>
                </View>
              </View>
              <View style={styles.footer}>
                <Text style={styles.price}><DollarSign size={14} color="#F8FAFC" /> {doc.session_price} / session</Text>
                <TouchableOpacity style={styles.bookBtn} onPress={() => handleBookSlot(doc.id, doc.session_price)}>
                  <Text style={styles.bookText}>Book Slot</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 20, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  searchInput: { flex: 1, marginLeft: 8, color: '#F8FAFC', fontSize: 16 },
  scroll: { padding: 20 },
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  image: { width: 64, height: 64, borderRadius: 32 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC' },
  spec: { fontSize: 14, color: '#0ea5e9', marginTop: 4 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#0F172A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#94A3B8', fontSize: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#334155' },
  price: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  bookBtn: { backgroundColor: '#0ea5e9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  bookText: { color: '#fff', fontWeight: '600' }
});
