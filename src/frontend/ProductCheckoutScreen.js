import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { Box, Repeat, Minus, Plus } from 'lucide-react-native';
import Header from './components/Header';
import MinimalButton from './components/MinimalButton';
import { useTheme } from './context/ThemeContext';

const ProductCheckoutScreen = ({ product, navigate, user, onRefreshUser }) => {
    const { isDarkMode, colors } = useTheme();
    const [quantity, setQuantity] = useState(1);
    const [months, setMonths] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!product) return <View style={styles.center}><Text>Product not found</Text></View>;

    const totalCoins = product.price_coin * quantity * months;

    const handleRedeem = async () => {
        if (!user || !user.users_id) {
            Alert.alert('Error', 'User information not found. Please login again.');
            return;
        }

        if (user.coins < totalCoins) {
            Alert.alert('Insufficient Coins', 'You do not have enough coins to redeem this item.');
            return;
        }

        setIsProcessing(true);
        try {
            // Android Emulator API BASE
            const API_BASE = 'http://10.0.2.2:3000';

            const response = await fetch(`${API_BASE}/buy/buy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.users_id,
                    product_id: product.products_id,
                    quantity: quantity,
                    months: months
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Refresh global user state with updated data from backend
                if (onRefreshUser) await onRefreshUser(result.user);

                Alert.alert('Success!', `Successfully redeemed ${product.name}!`, [
                    { text: 'OK', onPress: () => navigate('history') }
                ]);
            } else {
                Alert.alert('Redemption Failed', result.error || 'Something went wrong');
            }
        } catch (error) {
            console.error('Redeem error:', error);
            Alert.alert('Error', 'Could not connect to server.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Confirm Redemption" onBack={() => navigate('productDetail')} />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Product Summary */}
                <View style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? colors.background : '#fafafa', overflow: 'hidden' }]}>
                        {product.image_uri ? (
                            <Image source={{ uri: product.image_uri }} style={styles.productImage} />
                        ) : product.image ? (
                            <Image source={{ uri: product.image }} style={styles.productImage} />
                        ) : (
                            <Text style={styles.iconText}>{product.icon}</Text>
                        )}
                    </View>
                    <View>
                        <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
                        <Text style={styles.productPrice}>{product.price_coin?.toLocaleString() || '-'} Coins / unit</Text>
                    </View>
                </View>

                {/* Quantity Selector */}
                <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.sectionHeaderLine}>
                        <View style={styles.headerLabel}>
                            <Box size={20} color={colors.text} />
                            <Text style={[styles.headerText, { color: colors.text }]}>Quantity</Text>
                        </View>
                        <Text style={[styles.subHeader, { color: colors.subText }]}>How many pieces?</Text>
                    </View>
                    <View style={[styles.quantityControl, { backgroundColor: isDarkMode ? colors.background : '#fafafa', borderColor: colors.border }]}>
                        <TouchableOpacity
                            onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            style={[
                                styles.qtButton,
                                quantity <= 1 && styles.buttonDisabled,
                                { backgroundColor: colors.card, borderColor: colors.border }
                            ]}
                        >
                            <Minus size={18} color={quantity <= 1 ? colors.subText : colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.qtValue, { color: colors.text }]}>{quantity}</Text>
                        <TouchableOpacity
                            onPress={() => setQuantity(quantity + 1)}
                            style={[styles.qtButton, styles.buttonDark, { backgroundColor: isDarkMode ? '#f4f4f5' : '#18181b', borderColor: isDarkMode ? '#f4f4f5' : '#18181b' }]}
                        >
                            <Plus size={18} color={isDarkMode ? '#18181b' : '#ffffff'} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recurring Delivery Selector */}
                <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.sectionHeaderLine}>
                        <View style={styles.headerLabel}>
                            <Repeat size={20} color={colors.text} />
                            <Text style={[styles.headerText, { color: colors.text }]}>Recurring Delivery</Text>
                        </View>
                        <Text style={[styles.subHeader, { color: colors.subText }]}>Repeat this order?</Text>
                    </View>
                    <View style={styles.grid}>
                        {[1, 3, 6, 12].map((m) => (
                            <TouchableOpacity
                                key={m}
                                onPress={() => setMonths(m)}
                                style={[
                                    styles.durationButton,
                                    months === m
                                        ? [styles.durationActive, { backgroundColor: isDarkMode ? '#f4f4f5' : '#18181b', borderColor: isDarkMode ? '#f4f4f5' : '#18181b' }]
                                        : [styles.durationInactive, { backgroundColor: colors.card, borderColor: colors.border }]
                                ]}
                            >
                                <Text style={[styles.durationText, months === m ? { color: isDarkMode ? '#18181b' : '#ffffff' } : { color: colors.subText }]}>
                                    {m === 1 ? 'One-time' : `${m} Months`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Summary & Confirm */}
                <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.summaryRows}>
                        <View style={styles.row}>
                            <Text style={[styles.rowLabel, { color: colors.subText }]}>Subtotal ({quantity} items)</Text>
                            <Text style={[styles.rowValue, { color: colors.subText }]}>{product.price_coin ? (product.price_coin * quantity).toLocaleString() : '-'}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.rowLabel, { color: colors.subText }]}>Duration</Text>
                            <Text style={[styles.rowValue, { color: colors.subText }]}>{months === 1 ? '1 Month' : `${months} Months`}</Text>
                        </View>
                        <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
                            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Coins</Text>
                            <Text style={styles.totalValue}>{totalCoins.toLocaleString()}</Text>
                        </View>
                    </View>
                    <MinimalButton
                        fullWidth
                        onClick={handleRedeem}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Confirm & Redeem'}
                    </MinimalButton>
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
        gap: 24,
    },
    productCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 64,
        height: 64,
        backgroundColor: '#fafafa',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 24,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#18181b',
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#f59e0b',
    },
    sectionCard: {
        backgroundColor: '#ffffff',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e4e4e7',
    },
    sectionHeaderLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerText: {
        fontWeight: 'bold',
        color: '#18181b',
    },
    subHeader: {
        fontSize: 12,
        color: '#71717a',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fafafa',
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: '#f4f4f5',
    },
    qtButton: {
        width: 40,
        height: 40,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e4e4e7',
    },
    buttonDark: {
        backgroundColor: '#18181b',
        borderColor: '#18181b',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    qtValue: {
        fontSize: 20,
        fontWeight: 'bold',
        width: 48,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between', // Basic distribution
    },
    durationButton: {
        width: '48%',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    durationActive: {
        backgroundColor: '#18181b',
        borderColor: '#18181b',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    durationInactive: {
        backgroundColor: '#ffffff',
        borderColor: '#e4e4e7',
    },
    durationText: {
        fontSize: 14,
        fontWeight: '500',
    },
    textWhite: {
        color: '#ffffff',
    },
    textZinc: {
        color: '#52525b',
    },
    summaryCard: {
        backgroundColor: '#ffffff',
        padding: 24,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#f4f4f5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    summaryRows: {
        gap: 8,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowLabel: {
        color: '#71717a',
        fontSize: 14,
    },
    rowValue: {
        color: '#71717a',
        fontSize: 14,
        fontWeight: '500',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#f4f4f5',
        paddingTop: 12,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18181b',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f59e0b',
    }
});

export default ProductCheckoutScreen;
