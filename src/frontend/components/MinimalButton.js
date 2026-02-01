import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const MinimalButton = ({ children, onClick, variant = 'primary', className = '', icon: Icon, fullWidth = false, disabled = false }) => {
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            onPress={onClick}
            disabled={disabled}
            style={[
                styles.base,
                fullWidth && styles.fullWidth,
                isPrimary ? styles.primary : styles.secondary,
                disabled && styles.disabled,
                // Helper to allow passing style objects via className prop if we were using it for styles, 
                // but for now we'll ignore string classNames or expect style objects
            ]}
        >
            {Icon && <Icon size={18} color={isPrimary ? '#FFF' : '#18181b'} style={{ marginRight: 8 }} />}
            <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginVertical: 4,
    },
    fullWidth: {
        width: '100%',
    },
    primary: {
        backgroundColor: '#18181b', // zinc-900
        shadowColor: '#e4e4e7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 4,
    },
    secondary: {
        backgroundColor: '#f4f4f5', // zinc-100
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    textPrimary: {
        color: '#FFFFFF',
    },
    textSecondary: {
        color: '#18181b',
    },
});

export default MinimalButton;
