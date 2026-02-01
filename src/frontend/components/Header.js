import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

const Header = ({ title, onBack, rightAction }) => (
    <View style={styles.container}>
        <View style={styles.leftContainer}>
            {onBack && (
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={24} color="#18181b" />
                </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.rightContainer}>
            {rightAction}
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: '#ffffff', // white
        borderBottomWidth: 1,
        borderBottomColor: '#fafafa', // zinc-50
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18181b', // zinc-900
    },
    rightContainer: {
        // Space for right action
    }
});

export default Header;
