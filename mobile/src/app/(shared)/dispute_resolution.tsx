import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function DisputeResolution() {
    const [disputeText, setDisputeText] = useState('');

    const handleSubmit = () => {
        Alert.alert('Dispute Submitted', 'Our support team will contact you shortly.');
        setDisputeText('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dispute Resolution</Text>
            <Text style={styles.subtitle}>Please describe the issue you are facing:</Text>
            <TextInput
                style={styles.input}
                multiline
                numberOfLines={6}
                placeholder="Enter details here..."
                value={disputeText}
                onChangeText={setDisputeText}
            />
            <Button title="Submit Dispute" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { fontSize: 16, marginBottom: 16, color: '#555' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, textAlignVertical: 'top' }
});
