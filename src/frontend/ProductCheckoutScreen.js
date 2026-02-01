import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Box, Repeat, Minus, Plus } from 'lucide-react-native';
import Header from './components/Header';
import MinimalButton from './components/MinimalButton';

const ProductCheckoutScreen = ({ product, navigate }) => {
    const [quantity, setQuantity] = useState(1);
    const [months, setMonths] = useState(1);

    if (!product) return <View style={styles.center}><Text>Product not found</Text></View>;

    const totalCoins = product.price * quantity * months;

    return (
        <View style={styles.container}>
            <Header title="Confirm Redemption" onBack={() => navigate('productDetail')} />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Product Summary */}
                <View style={styles.productCard}>
                    <View style={styles.iconContainer}><Text style={styles.iconText}>{product.icon}</Text></View>
                    <View>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productPrice}>{product.price.toLocaleString()} Coins / unit</Text>
                    </View>
                </View>

                {/* Quantity Selector */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeaderLine}>
                        <View style={styles.headerLabel}>
                            <Box size={20} color="#18181b" />
                            <Text style={styles.headerText}>Quantity</Text>
                        </View>
                        <Text style={styles.subHeader}>How many pieces?</Text>
                    </View>
                    <View style={styles.quantityControl}>
                        <TouchableOpacity
                            onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            style={[styles.qtButton, quantity <= 1 && styles.buttonDisabled]}
                        >
                            <Minus size={18} color="#18181b" />
                        </TouchableOpacity>
                        <Text style={styles.qtValue}>{quantity}</Text>
                        <TouchableOpacity
                            onPress={() => setQuantity(quantity + 1)}
                            style={[styles.qtButton, styles.buttonDark]}
                        >
                            <Plus size={18} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recurring Delivery Selector */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeaderLine}>
                        <View style={styles.headerLabel}>
                            <Repeat size={20} color="#18181b" />
                            <Text style={styles.headerText}>Recurring Delivery</Text>
                        </View>
                        <Text style={styles.subHeader}>Repeat this order?</Text>
                    </View>
                    <View style={styles.grid}>
                        {[1, 3, 6, 12].map((m) => (
                            <TouchableOpacity
                                key={m}
                                onPress={() => setMonths(m)}
                                style={[styles.durationButton, months === m ? styles.durationActive : styles.durationInactive]}
                            >
                                <Text style={[styles.durationText, months === m ? styles.textWhite : styles.textZinc]}>
                                    {m === 1 ? 'One-time' : `${m} Months`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Summary & Confirm */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRows}>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Subtotal ({quantity} items)</Text>
                            <Text style={styles.rowValue}>{(product.price * quantity).toLocaleString()}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Duration</Text>
                            <Text style={styles.rowValue}>{months === 1 ? '1 Month' : `${months} Months`}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Coins</Text>
                            <Text style={styles.totalValue}>{totalCoins.toLocaleString()}</Text>
                        </View>
                    </View>
                    <MinimalButton fullWidth onClick={() => {
                        Alert.alert('Redeemed!', `Successfully redeemed ${product.name} x${quantity} for ${months} months! Total: ${totalCoins} Coins.`);
                        navigate('history');
                    }}>
                        Confirm & Redeem
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
