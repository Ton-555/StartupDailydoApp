import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Crown, Check } from 'lucide-react-native';
import Header from './components/Header';

const PackageScreen = ({ navigate, onSelectPackage }) => {
    const packages = [
        { id: 1, name: 'Starter', price: 'Free', color: '#f4f4f5', textColor: '#18181b', features: ['Basic rewards', '50 Coins/month', 'Standard Support'], icon: null },
        { id: 2, name: 'Silver', price: '฿99/mo', color: '#e2e8f0', textColor: '#1e293b', features: ['2x Coin Multiplier', '200 Coins/month', 'Priority Support', 'No Ads'], icon: null },
        { id: 3, name: 'Gold', price: '฿299/mo', color: '#fef9c3', textColor: '#854d0e', icon: Crown, features: ['5x Coin Multiplier', '1000 Coins/month', 'VIP Access', 'Exclusive Deals', 'Free Shipping'], isPopular: true }
    ];

    return (
        <View style={styles.container}>
            <Header title="Packages" onBack={() => navigate('home')} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Choose Your Plan</Text>
                    <Text style={styles.subtitle}>Unlock exclusive benefits and more coins.</Text>
                </View>
                {packages.map((pkg) => (
                    <View key={pkg.id} style={[styles.card, pkg.isPopular && styles.popularCard]}>
                        <View style={styles.cardHeader}>
                            <View>
                                <View style={styles.cardTitleRow}>
                                    {pkg.icon && <pkg.icon size={18} color="#854d0e" style={{ marginRight: 8 }} />}
                                    <Text style={[styles.cardTitle, { color: pkg.textColor }]}>{pkg.name}</Text>
                                </View>
                                <Text style={styles.cardPrice}>{pkg.price}</Text>
                            </View>
                            {pkg.isPopular && (
                                <View style={styles.popularBadge}>
                                    <Text style={styles.popularText}>Most Popular</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.featuresList}>
                            {pkg.features.map((feat, idx) => (
                                <View key={idx} style={styles.featureItem}>
                                    <View style={[styles.checkCircle, pkg.isPopular ? styles.checkPopular : styles.checkRegular]}>
                                        <Check size={12} color={pkg.isPopular ? '#ca8a04' : '#71717a'} />
                                    </View>
                                    <Text style={styles.featureText}>{feat}</Text>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity
                            onPress={() => onSelectPackage({ type: 'package', name: pkg.name + ' Plan', price: pkg.price, detail: 'Monthly Subscription' })}
                            style={[styles.button, pkg.isPopular ? styles.buttonPopular : styles.buttonRegular]}
                        >
                            <Text style={[styles.buttonText, pkg.isPopular ? styles.textPopular : styles.textRegular]}>
                                Choose {pkg.name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
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
        paddingBottom: 40,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#18181b',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#71717a',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#e4e4e7',
    },
    popularCard: {
        borderColor: '#facc15', // yellow-400
        backgroundColor: '#ffffff',
        // In RN, shadows are platform specific or use elevation
        elevation: 4,
        shadowColor: '#fef08a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardPrice: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#18181b',
        marginTop: 8,
    },
    popularBadge: {
        backgroundColor: '#fef9c3', // yellow-100
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 100,
    },
    popularText: {
        color: '#a16207', // yellow-700
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    featuresList: {
        gap: 12,
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkPopular: {
        backgroundColor: '#fef9c3', // yellow-100
    },
    checkRegular: {
        backgroundColor: '#f4f4f5', // zinc-100
    },
    featureText: {
        fontSize: 14,
        color: '#52525b', // zinc-600
    },
    button: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPopular: {
        backgroundColor: '#facc15', // yellow-400
    },
    buttonRegular: {
        backgroundColor: '#18181b', // zinc-900
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    textPopular: {
        color: '#713f12', // yellow-900
    },
    textRegular: {
        color: '#ffffff',
    }
});

export default PackageScreen;
