import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { User, Mail, Phone, CreditCard, Calendar } from 'lucide-react-native';
import Header from './components/Header';
import { useTheme } from './context/ThemeContext';

const SettingsScreen = ({ user, navigate }) => {
    const { isDarkMode, colors } = useTheme();

    const InfoRow = ({ icon: Icon, label, value }) => (
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <View style={styles.infoLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? colors.background : '#fafafa' }]}>
                    <Icon size={20} color={colors.subText} />
                </View>
                <Text style={[styles.label, { color: colors.subText }]}>{label}</Text>
            </View>
            <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Settings" onBack={() => navigate('profile')} />

            <ScrollView contentContainerStyle={styles.content}>
                {/* User Info Card */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>User Information</Text>
                    </View>

                    <InfoRow icon={User} label="Full Name" value={user?.fullName || 'N/A'} />
                    <InfoRow icon={Mail} label="Email" value={user?.email || 'N/A'} />
                    <InfoRow icon={Phone} label="Phone" value={user?.phone || 'N/A'} />
                    <InfoRow icon={CreditCard} label="Member ID" value={user?.idMember || 'N/A'} />
                    <InfoRow icon={Calendar} label="Username" value={user?.username || 'N/A'} />
                </View>

                {/* Account Stats Card */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>Account Stats</Text>
                    </View>

                    <View style={[styles.statsRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.statsLabel, { color: colors.subText }]}>Current Coins</Text>
                        <Text style={[styles.statsValue, { color: '#f59e0b' }]}>{user?.coins?.toLocaleString() || '0'}</Text>
                    </View>
                </View>

                {/* App Info */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>App Information</Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.subText }]}>Version</Text>
                        <Text style={[styles.value, { color: colors.text }]}>1.0.0</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.label, { color: colors.subText }]}>Build</Text>
                        <Text style={[styles.value, { color: colors.text }]}>2024.02.13</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    content: {
        padding: 16,
        gap: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f4f4f5',
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f5',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#18181b',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f5',
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconBox: {
        padding: 8,
        backgroundColor: '#fafafa',
        borderRadius: 8,
    },
    label: {
        fontSize: 14,
        color: '#71717a',
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: '#18181b',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    statsLabel: {
        fontSize: 14,
        color: '#71717a',
    },
    statsValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f59e0b',
    },
});

export default SettingsScreen;
