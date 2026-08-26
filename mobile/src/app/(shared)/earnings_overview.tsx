import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function EarningsOverview() {
    const { authenticatedFetch } = useAuth();
    const [earnings, setEarnings] = useState({ total_earnings: "$0.00", recent_transactions: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const res = await authenticatedFetch('/api/billing/earnings');
                if (res.ok) {
                    setEarnings(await res.json());
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, [authenticatedFetch]);

    if (loading) {
        return <ActivityIndicator color="#0ea5e9" style={{ marginTop: 20 }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Earnings Overview</Text>
            <View style={styles.card}>
                <Text style={styles.label}>Total Earnings</Text>
                <Text style={styles.amount}>{earnings.total_earnings}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Recent Transactions</Text>
                {earnings.recent_transactions.length === 0 ? (
                    <Text>No recent transactions.</Text>
                ) : (
                    earnings.recent_transactions.map((txn: any) => (
                        <View key={txn.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
                            <Text>{txn.date}</Text>
                            <Text>{txn.amount}</Text>
                        </View>
                    ))
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f4f4f4' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    label: { fontSize: 16, color: '#666', marginBottom: 8 },
    amount: { fontSize: 28, fontWeight: 'bold', color: '#2b6cb0' }
});
