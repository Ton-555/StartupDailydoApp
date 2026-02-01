import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, ShoppingBag, Clock, User } from 'lucide-react-native';

const BottomNav = ({ currentScreen, navigate }) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'shop', icon: ShoppingBag, label: 'Shop' },
        { id: 'history', icon: Clock, label: 'History' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                {navItems.map((item) => {
                    const isActive = currentScreen === item.id ||
                        (currentScreen === 'historyDetail' && item.id === 'history') ||
                        (currentScreen === 'productDetail' && item.id === 'shop') ||
                        (currentScreen === 'productCheckout' && item.id === 'shop');
                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => navigate(item.id)}
                            style={styles.item}
                        >
                            <item.icon size={24} color={isActive ? '#18181b' : '#a1a1aa'} strokeWidth={isActive ? 2.5 : 2} />
                            {isActive && <View style={styles.activeDot} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f4f4f5',
        paddingBottom: 24, // Safety padding for bottom
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.02,
        shadowRadius: 20,
        elevation: 8,
    },
    inner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 64,
        paddingHorizontal: 24,
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
    },
    activeDot: {
        position: 'absolute',
        bottom: 0,
        width: 4,
        height: 4,
        backgroundColor: '#18181b', // zinc-900
        borderRadius: 2,
    }
});

export default BottomNav;
