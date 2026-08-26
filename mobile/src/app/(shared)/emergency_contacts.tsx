import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Linking } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { PhoneCall, AlertCircle } from 'lucide-react-native';

export default function EmergencyContacts() {
    const { authenticatedFetch } = useAuth();
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await authenticatedFetch('/api/users/emergency-contacts');
                if (res.ok) setContacts(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, [authenticatedFetch]);

    if (loading) {
        return <ActivityIndicator color="#ef4444" style={{ marginTop: 20 }} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <PhoneCall size={28} color="#ef4444" />
                <Text style={styles.title}>Emergency Contacts</Text>
            </View>
            
            <View style={styles.alertBox}>
                <AlertCircle size={20} color="#ef4444" />
                <Text style={styles.alertText}>
                    If you are experiencing a life-threatening emergency, please call your local emergency services immediately.
                </Text>
            </View>

            <FlatList
                data={contacts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.contactName}>{item.name}</Text>
                            <Text style={styles.contactType}>{item.type}</Text>
                        </View>
                        <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${item.phone}`)}>
                            <PhoneCall size={16} color="#fff" />
                            <Text style={styles.callBtnText}>{item.phone}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f4f4f4' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginLeft: 12 },
    alertBox: { flexDirection: 'row', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: 8, marginBottom: 20, alignItems: 'center' },
    alertText: { color: '#ef4444', fontWeight: 'bold', marginLeft: 12, flex: 1 },
    card: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, alignItems: 'center', elevation: 1, borderLeftWidth: 4, borderLeftColor: '#ef4444' },
    contactName: { fontSize: 16, fontWeight: 'bold' },
    contactType: { color: '#999', fontSize: 12, textTransform: 'uppercase', marginTop: 4 },
    callBtn: { flexDirection: 'row', backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
    callBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 }
});
