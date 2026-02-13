import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Coins } from 'lucide-react-native';
import Header from './components/Header';
import { useTheme } from './context/ThemeContext';

const TopUpScreen = ({ navigate, onSelectPackage }) => {
    const { isDarkMode, colors } = useTheme();
    const coinPackages = [{ coins: 5, price: 5 }, { coins: 10, price: 10 }, { coins: 25, price: 25 }, { coins: 50, price: 50 }, { coins: 100, price: 100 }];
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Top Up Coins" onBack={() => navigate('profile')} />
            <View style={styles.content}>
                <View style={styles.headerSection}>
                    <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#451a03' : '#fef3c7' }]}><Coins size={32} color="#d97706" /></View>
                    <Text style={[styles.title, { color: colors.text }]}>Select Amount</Text>
                    <Text style={[styles.subtitle, { color: colors.subText }]}>1 THB = 1 Coin</Text>
                </View>
                <View style={styles.grid}>
                    {coinPackages.map((pkg) => (
                        <TouchableOpacity
                            key={pkg.coins}
                            onPress={() => onSelectPackage({ type: 'coin', name: `${pkg.coins} Coins`, price: `฿${pkg.price}`, detail: 'Instant Top Up' })}
                            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                        >
                            <Text style={[styles.coinAmount, { color: colors.text }]}>{pkg.coins}</Text>
                            <Text style={[styles.coinLabel, { color: colors.subText }]}>Coins</Text>
                            <View style={[styles.priceTag, { backgroundColor: isDarkMode ? colors.background : '#f4f4f5' }]}>
                                <Text style={[styles.priceText, { color: isDarkMode ? colors.subText : '#52525b' }]}>฿{pkg.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
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
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 64,
        height: 64,
        backgroundColor: '#fef3c7', // yellow-100
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#18181b',
    },
    subtitle: {
        fontSize: 14,
        color: '#71717a',
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
    },
    card: {
        width: '47%', // roughly half - gap
        backgroundColor: '#ffffff',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    coinAmount: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#18181b',
    },
    coinLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#71717a',
        textTransform: 'uppercase',
    },
    priceTag: {
        marginTop: 8,
        backgroundColor: '#f4f4f5',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priceText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#52525b',
    }
});

export default TopUpScreen;
