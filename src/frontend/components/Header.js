import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Moon, Sun } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title, onBack, rightAction }) => {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <View style={styles.leftContainer}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                )}
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            </View>
            <View style={styles.rightContainer}>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                    {isDarkMode ? <Sun size={20} color="#facc15" /> : <Moon size={20} color="#18181b" />}
                </TouchableOpacity>
                {rightAction}
            </View>
        </View>
    );
};

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
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    themeToggle: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
    }
});

export default Header;
