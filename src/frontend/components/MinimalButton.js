import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const MinimalButton = ({ children, onClick, variant = 'primary', className = '', icon: Icon, fullWidth = false, disabled = false, loading = false }) => {
    const { isDarkMode, colors } = useTheme();
    const isPrimary = variant === 'primary';
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onClick}
            disabled={isDisabled}
            style={[
                styles.base,
                fullWidth && styles.fullWidth,
                isPrimary
                    ? [styles.primary, { backgroundColor: colors.primary, shadowColor: isDarkMode ? '#000' : '#e4e4e7' }]
                    : [styles.secondary, { backgroundColor: colors.secondary }],
                isDisabled && styles.disabled,
            ]}
        >
            {Icon && !loading && <Icon size={18} color={isPrimary ? (isDarkMode ? '#18181b' : '#FFF') : colors.text} style={{ marginRight: 8 }} />}
            <Text style={[
                styles.text,
                isPrimary
                    ? { color: isDarkMode ? '#18181b' : '#FFF' }
                    : { color: colors.text }
            ]}>
                {loading ? 'Processing...' : children}
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
