import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function BillingInvoices() {
    const { authenticatedFetch } = useAuth();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await authenticatedFetch('/api/billing/invoices');
                if (res.ok) {
                    setInvoices(await res.json());
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, [authenticatedFetch]);

    if (loading) {
        return <ActivityIndicator color="#0ea5e9" style={{ marginTop: 20 }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Billing & Invoices</Text>
            <FlatList
                data={invoices}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.date}>{item.date}</Text>
                        <Text style={styles.amount}>{item.amount}</Text>
                        <Text style={[styles.status, { color: item.status === 'Success' ? 'green' : 'orange' }]}>
                            {item.status}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={<Text>No invoices found.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    item: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', marginBottom: 8, borderRadius: 8 },
    date: { fontSize: 16, flex: 1 },
    amount: { fontSize: 16, fontWeight: 'bold', flex: 1, textAlign: 'center' },
    status: { fontSize: 16, flex: 1, textAlign: 'right' }
});
