import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const MinimalInputNative = ({ label, type = "text", value, onChange, placeholder }) => (
    <View style={styles.wrapper}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.container}>
            <TextInput
                secureTextEntry={type === 'password'}
                value={value}
                onChangeText={onChange} // props.onChange usually expects text in RN if we pass (text) => ...
                placeholder={placeholder}
                placeholderTextColor="#a1a1aa"
                style={styles.input}
            />
        </View>
    </View>
);

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        color: '#71717a', // zinc-500
        fontSize: 12,
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    container: {
        backgroundColor: '#fafafa', // zinc-50
        borderWidth: 1,
        borderColor: '#e4e4e7', // zinc-200
        borderRadius: 12,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 14,
        color: '#18181b', // zinc-900
    },
});

export default MinimalInputNative;
