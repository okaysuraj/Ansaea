import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function BillingInvoices() {
    const invoices = [
        { id: '1', date: '2023-10-01', amount: '$50.00', status: 'Paid' },
        { id: '2', date: '2023-10-15', amount: '$120.00', status: 'Pending' },
    ];

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
                        <Text style={[styles.status, { color: item.status === 'Paid' ? 'green' : 'orange' }]}>
                            {item.status}
                        </Text>
                    </View>
                )}
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
