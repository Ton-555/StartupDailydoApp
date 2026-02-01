import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Gift } from 'lucide-react-native';
import Header from './components/Header';

const ShopScreenV2 = ({ onSelectProduct }) => {
    const [category, setCategory] = useState('consumer'); // 'consumer' | 'consumable'
    const [products, setProducts] = useState({ consumer: [], consumable: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Replace with your machine's IP address if running on emulator (e.g., 'http://10.0.2.2:3000')
    // or your local network IP (e.g., 'http://192.168.1.5:3000') if running on physical device
    const API_URL = 'http://10.0.2.2:3000/api/products';

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. " + err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#18181b" />
                <Text style={styles.loadingText}>Loading Items...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchProducts} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Redeem Shop V2" />
            <View style={styles.tabContainer}>
                <View style={styles.tabsWrapper}>
                    <TouchableOpacity
                        onPress={() => setCategory('consumer')}
                        style={[styles.tab, category === 'consumer' ? styles.tabActive : styles.tabInactive]}
                    >
                        <Text style={[styles.tabText, category === 'consumer' ? styles.tabTextActive : styles.tabTextInactive]}>สินค้าอุปโภค</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setCategory('consumable')}
                        style={[styles.tab, category === 'consumable' ? styles.tabActive : styles.tabInactive]}
                    >
                        <Text style={[styles.tabText, category === 'consumable' ? styles.tabTextActive : styles.tabTextInactive]}>สินค้าบริโภค</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.productList}>
                {products[category]?.length > 0 ? (
                    products[category].map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => onSelectProduct(item)} style={styles.productCard}>
                            <View style={styles.productInfo}>
                                <View style={styles.productIconContainer}>
                                    <Text style={styles.productIcon}>{item.icon}</Text>
                                </View>
                                <View>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <View style={styles.priceRow}>
                                        <Gift size={14} color="#f59e0b" />
                                        <Text style={styles.priceText}>{item.price.toLocaleString()} Coins</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.redeemButton}>
                                <Text style={styles.redeemText}>Redeem</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No items available in this category.</Text>
                    </View>
                )}
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
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        color: '#71717a',
        fontSize: 16,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#18181b',
        borderRadius: 8,
    },
    retryText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    tabContainer: {
        padding: 16,
        backgroundColor: 'rgba(250, 250, 250, 0.95)',
        zIndex: 10,
    },
    tabsWrapper: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e4e4e7',
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: '#18181b', // zinc-900
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tabInactive: {
        backgroundColor: 'transparent',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#ffffff',
    },
    tabTextInactive: {
        color: '#71717a',
    },
    productList: {
        padding: 16,
        paddingTop: 0,
        gap: 12,
    },
    productCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f4f4f5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    productIconContainer: {
        width: 64,
        height: 64,
        backgroundColor: '#fafafa',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productIcon: {
        fontSize: 32,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#18181b',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    priceText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#f59e0b', // amber-500
    },
    redeemButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#18181b',
    },
    redeemText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        color: '#a1a1aa',
    }
});

export default ShopScreenV2;
