import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Crown, Check } from 'lucide-react-native';
import Header from './components/Header';
import { useTheme } from './context/ThemeContext';

const PackageScreen = ({ navigate, onSelectPackage, user }) => {
    const { isDarkMode, colors } = useTheme();
    const [hasActiveSub, setHasActiveSub] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [packages, setPackages] = React.useState([]);

    React.useEffect(() => {
        fetchPackages();
        if (user?.users_id) {
            checkSubscription();
        }
    }, [user]);

    const fetchPackages = async () => {
        try {
            const API_BASE = 'http://10.0.2.2:3000';
            const res = await fetch(`${API_BASE}/package/all`);
            const json = await res.json();
            if (json.success) {
                console.log('[PackageScreen] Raw packages:', json.data);
                const mapped = json.data.map(p => ({
                    id: p.package_id,
                    packageId: p.package_id,
                    name: p.package_name || 'Unnamed Plan',
                    price: `฿${p.price || 0}/mo`,
                    priceSatang: (p.price || 0) * 100,
                    coin: p.coin || 0,
                    color: p.package_id === 1 ? '#f4f4f5' : (p.package_id === 2 ? '#e2e8f0' : '#fef9c3'),
                    textColor: p.package_id === 1 ? '#18181b' : (p.package_id === 2 ? '#1e293b' : '#854d0e'),
                    features: [p.description_1, p.description_2, p.description_3, p.description_4].filter(Boolean),
                    isPopular: p.package_id === 3,
                    icon: p.package_id === 3 ? Crown : null
                }));
                setPackages(mapped);
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkSubscription = async () => {
        if (!user || !user.users_id) {
            console.log('[PackageScreen] No user ID available for check');
            return;
        }
        try {
            // We can check user.package_end directly if it's passed in props, 
            // but fetching ensures the latest state.
            const API_BASE = 'http://10.0.2.2:3000';
            const res = await fetch(`${API_BASE}/users/id/${user.users_id}`);
            const json = await res.json();

            if (json.success && json.data && json.data.package_end) {
                const endDate = new Date(json.data.package_end);
                if (endDate > new Date()) {
                    setHasActiveSub(true);
                }
            }
        } catch (error) {
            console.error('Error checking sub in PackageScreen:', error);
        }
    };

    const handleSelect = (pkg) => {
        if (hasActiveSub) {
            Alert.alert(
                'Already Subscribed',
                'You already have an active subscription. You can only subscribe to one package per month.'
            );
            return;
        }
        onSelectPackage({
            type: 'package',
            name: pkg.name + ' Plan',
            packageId: pkg.packageId,
            price: pkg.priceSatang > 0 ? `฿${pkg.priceSatang / 100}` : 'Free',
            priceSatang: pkg.priceSatang,
            coin: pkg.coin,
            detail: 'Monthly Subscription'
        });
    };

    if (loading) return <View style={styles.center}><Text>Loading...</Text></View>;
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Packages" onBack={() => navigate('home')} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerSection}>
                    <Text style={[styles.title, { color: colors.text }]}>Choose Your Plan</Text>
                    <Text style={[styles.subtitle, { color: colors.subText }]}>Unlock exclusive benefits and more coins.</Text>
                </View>
                {packages.map((pkg) => (
                    <View key={pkg.id} style={[
                        styles.card,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        pkg.isPopular && [styles.popularCard, { borderColor: '#facc15' }]
                    ]}>
                        <View style={styles.cardHeader}>
                            <View>
                                <View style={styles.cardTitleRow}>
                                    {pkg.icon && <pkg.icon size={18} color="#854d0e" style={{ marginRight: 8 }} />}
                                    <Text style={[styles.cardTitle, { color: isDarkMode && !pkg.isPopular ? colors.text : pkg.textColor }]}>{pkg.name}</Text>
                                </View>
                                <Text style={[styles.cardPrice, { color: colors.text }]}>{pkg.price}</Text>
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
                                    <View style={[
                                        styles.checkCircle,
                                        pkg.isPopular ? styles.checkPopular : [styles.checkRegular, { backgroundColor: isDarkMode ? colors.background : '#f4f4f5' }]
                                    ]}>
                                        <Check size={12} color={pkg.isPopular ? '#ca8a04' : colors.subText} />
                                    </View>
                                    <Text style={[styles.featureText, { color: isDarkMode ? '#d4d4d8' : '#52525b' }]}>{feat}</Text>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity
                            onPress={() => handleSelect(pkg)}
                            style={[
                                styles.button,
                                pkg.isPopular ? styles.buttonPopular : [styles.buttonRegular, { backgroundColor: isDarkMode ? '#3f3f46' : '#18181b' }]
                            ]}
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
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default PackageScreen;