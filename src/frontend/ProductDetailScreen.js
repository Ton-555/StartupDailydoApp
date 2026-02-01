import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Gift, ArrowRight } from 'lucide-react-native';
import Header from './components/Header';
import MinimalButton from './components/MinimalButton';

const ProductDetailScreen = ({ product, navigate }) => {
    if (!product) return <View style={styles.center}><Text>Product not found</Text></View>;
    return (
        <View style={styles.container}>
            <Header title="Product Detail" onBack={() => navigate('shop')} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.imageContainer}>
                    <Text style={styles.productIcon}>{product.icon}</Text>
                </View>

                <Text style={styles.title}>{product.name}</Text>

                <View style={styles.priceTag}>
                    <Gift size={20} color="#f59e0b" />
                    <Text style={styles.priceText}>{product.price.toLocaleString()} Coins</Text>
                </View>

                <View style={styles.descriptionCard}>
                    <Text style={styles.descTitle}>Description</Text>
                    <Text style={styles.descText}>{product.description}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <MinimalButton fullWidth onClick={() => navigate('productCheckout')}>
                        Redeem Now <ArrowRight size={18} color="white" />
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
        padding: 24,
        alignItems: 'center',
    },
    imageContainer: {
        width: 192,
        height: 192,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#f4f4f5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    productIcon: {
        fontSize: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#18181b', // zinc-900
        marginBottom: 8,
    },
    priceTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fffbeb', // amber-50
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#fef3c7', // amber-100
        marginBottom: 24,
    },
    priceText: {
        color: '#b45309', // amber-700
        fontSize: 18,
        fontWeight: 'bold',
    },
    descriptionCard: {
        width: '100%',
        backgroundColor: '#ffffff',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        marginBottom: 32,
    },
    descTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#71717a', // zinc-500
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    descText: {
        fontSize: 14,
        color: '#52525b', // zinc-600
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
    }
});

export default ProductDetailScreen;
