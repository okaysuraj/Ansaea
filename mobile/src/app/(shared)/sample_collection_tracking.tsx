import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Truck } from 'lucide-react-native';

export default function SampleCollectionTracking() {
    const { authenticatedFetch } = useAuth();
    const [tracking, setTracking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTracking = async () => {
            try {
                const res = await authenticatedFetch('/api/lab/sample-tracking');
                if (res.ok) setTracking(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchTracking();
    }, [authenticatedFetch]);

    if (loading) {
        return <ActivityIndicator color="#0ea5e9" style={{ marginTop: 20 }} />;
    }

    if (!tracking) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Sample Collection Tracking</Text>
                <View style={styles.emptyBox}>
                    <Text>No active sample collections found.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Truck size={28} color="#0ea5e9" />
                <Text style={styles.title}>Sample Collection</Text>
            </View>
            <View style={styles.statusBox}>
                <Text style={styles.statusLabel}>Current Status:</Text>
                <Text style={styles.statusValue}>{tracking.status}</Text>
                <Text style={styles.details}>Tests: {tracking.test_names.join(', ')}</Text>
                <Text style={styles.details}>Estimated Arrival: {tracking.eta}</Text>
                <Text style={styles.details}>Agent: {tracking.agent}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f4f4f4' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginLeft: 12 },
    statusBox: { padding: 20, backgroundColor: '#fff', borderRadius: 8, elevation: 2, borderLeftWidth: 4, borderLeftColor: '#0ea5e9' },
    statusLabel: { fontSize: 14, color: '#666', marginBottom: 4 },
    statusValue: { fontSize: 22, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 12 },
    details: { fontSize: 14, color: '#444', marginTop: 8 },
    emptyBox: { padding: 20, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center' }
});
