import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CheckCircle, Box, Truck, MapPin, Gift } from 'lucide-react-native';
import Header from './components/Header';
import { useTheme } from './context/ThemeContext';

const HistoryDetailScreen = ({ item, navigate }) => {
    const { isDarkMode, colors } = useTheme();
    if (!item) return <View style={styles.center}><Text>Item not found</Text></View>;

    const timeline = [
        { status: 'Order Placed', date: '2026-01-24 10:30', active: true, icon: CheckCircle },
        { status: 'Preparing', date: '2026-01-24 14:00', active: true, icon: Box },
        { status: 'Shipping', date: '2026-01-25 09:00', active: item.status === 'shipping' || item.status === 'completed', icon: Truck },
        { status: 'Delivered', date: item.status === 'completed' ? '2026-01-26 12:00' : 'Expected 2026-01-26', active: item.status === 'completed', icon: MapPin },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Order Details" onBack={() => navigate('history')} />
            <ScrollView contentContainerStyle={styles.content}>

                {/* Order Info Card */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.infoRow}>
                        <View style={[styles.iconBox, { backgroundColor: isDarkMode ? colors.background : '#f4f4f5' }]}><Text style={{ fontSize: 32 }}>📦</Text></View>
                        <View style={styles.details}>
                            <Text style={[styles.productName, { color: colors.text }]}>{item.productName}</Text>
                            <Text style={[styles.trackingId, { color: colors.subText }]}>Tracking ID: {item.trackingId || 'Preparing...'}</Text>
                            <View style={styles.coinRow}>
                                <Gift size={16} color="#f59e0b" />
                                <Text style={styles.coinsText}>{item.coinsUsed} Coins</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Timeline Card */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Tracking Status</Text>
                    <View style={styles.timelineContainer}>
                        <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                        {timeline.map((step, idx) => (
                            <View key={idx} style={styles.timelineItem}>
                                <View style={[
                                    styles.stepIcon,
                                    step.active
                                        ? (isDarkMode ? styles.stepActiveDark : styles.stepActive)
                                        : (isDarkMode ? styles.stepInactiveDark : styles.stepInactive)
                                ]}>
                                    <step.icon size={14} color={step.active ? '#ffffff' : (isDarkMode ? '#52525b' : '#d4d4d8')} />
                                </View>
                                <View style={[styles.stepContent, !step.active && styles.opacityLow]}>
                                    <Text style={[styles.stepStatus, { color: colors.text }]}>{step.status}</Text>
                                    <Text style={[styles.stepDate, { color: colors.subText }]}>{step.date}</Text>
                                </View>
                            </View>
                        ))}
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
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: 16,
        gap: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e4e4e7',
    },
    infoRow: {
        flexDirection: 'row',
        gap: 16,
    },
    iconBox: {
        width: 80,
        height: 80,
        backgroundColor: '#f4f4f5', // zinc-100
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    details: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18181b',
        marginBottom: 4,
    },
    trackingId: {
        fontSize: 14,
        color: '#71717a',
        marginBottom: 8,
    },
    coinRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    coinsText: {
        color: '#f59e0b', // amber-500
        fontWeight: 'bold',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#18181b',
        marginBottom: 24,
    },
    timelineContainer: {
        paddingLeft: 8,
    },
    timelineLine: {
        position: 'absolute',
        left: 19, // Center of icon (11 + 8 padding) roughly
        top: 8,
        bottom: 24,
        width: 2,
        backgroundColor: '#f4f4f5',
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        marginBottom: 32,
    },
    stepIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        zIndex: 10,
    },
    stepActive: {
        backgroundColor: '#18181b',
        borderColor: '#18181b',
    },
    stepActiveDark: {
        backgroundColor: '#f4f4f5',
        borderColor: '#f4f4f5',
    },
    stepInactive: {
        backgroundColor: '#ffffff',
        borderColor: '#e4e4e7',
    },
    stepInactiveDark: {
        backgroundColor: '#27272a',
        borderColor: '#3f3f46',
    },
    stepContent: {
        flex: 1,
        paddingTop: 2,
    },
    opacityLow: {
        opacity: 0.4,
    },
    stepStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#18181b',
        marginBottom: 2,
    },
    stepDate: {
        fontSize: 12,
        color: '#71717a',
    }
});

export default HistoryDetailScreen;
