import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, AlertTriangle } from 'lucide-react-native';

export default function FraudAbuseMonitoring() {
    const { authenticatedFetch } = useAuth();
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await authenticatedFetch('/api/admin/fraud-alerts');
                if (res.ok) setAlerts(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, [authenticatedFetch]);

    if (loading) {
        return <ActivityIndicator color="#0ea5e9" style={{ marginTop: 20 }} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ShieldAlert size={28} color="#ef4444" />
                <Text style={styles.title}>Fraud & Abuse</Text>
            </View>
            
            <Text style={styles.subtitle}>
                Admin Dashboard for monitoring suspicious activities, fake accounts, and prescription abuse.
            </Text>

            <FlatList
                data={alerts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.card, { borderLeftColor: item.severity === 'high' ? '#ef4444' : '#f59e0b', borderLeftWidth: 4 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                            <AlertTriangle color={item.severity === 'high' ? '#ef4444' : '#f59e0b'} size={24} />
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={styles.alertType}>{item.type}</Text>
                                <Text style={styles.alertUser}>User: {item.user_id}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                                    <Text style={styles.alertStatus}>Status: {item.status}</Text>
                                    <Text style={styles.alertDate}>{item.timestamp.split(' ')[0]}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No recent fraudulent activity detected.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f4f4f4' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginLeft: 12 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 1 },
    alertType: { fontSize: 16, fontWeight: 'bold' },
    alertUser: { color: '#666', marginTop: 4 },
    alertStatus: { color: '#0ea5e9', fontSize: 12, textTransform: 'capitalize' },
    alertDate: { color: '#999', fontSize: 12 },
    emptyState: { padding: 16, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 8 },
    emptyText: { color: '#10b981', textAlign: 'center', fontWeight: 'bold' }
});
