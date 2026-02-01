import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './LoginScreen';
import OnboardingScreen from './OnboardingScreen';
import HomeScreen from './HomeScreen';
import PackageScreen from './PackageScreen';
import TopUpScreen from './TopUpScreen';
import PaymentScreen from './PaymentScreen';
import ShopScreen from './ShopScreen';
import ProductDetailScreen from './ProductDetailScreen';
import ProductCheckoutScreen from './ProductCheckoutScreen';
import HistoryScreen from './HistoryScreen';
import HistoryDetailScreen from './HistoryDetailScreen';
import ProfileScreen from './ProfileScreen';
import BottomNav from './components/BottomNav';

function App() {
    const [currentScreen, setCurrentScreen] = useState('login');
    const [user, setUser] = useState(null);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const navigate = (screen) => {
        setCurrentScreen(screen);
    };

    const login = (username) => {
        setUser({
            username,
            email: 'user@minimal.app',
            phone: '081-234-5678',
            fullName: username || 'Alex Doe',
            idMember: 'MB-8829',
            coins: 2450
        });
        navigate('onboarding');
    };

    const handleOnboardingComplete = () => {
        navigate('home');
    };

    const handleLogout = () => {
        setUser(null);
        navigate('login');
    };

    const handleSelectPurchase = (item) => {
        setSelectedPurchase(item);
        navigate('payment');
    }

    const handleSelectHistoryItem = (item) => {
        setSelectedHistoryItem(item);
        navigate('historyDetail');
    }

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        navigate('productDetail');
    }

    const renderScreen = () => {
        switch (currentScreen) {
            case 'login': return <LoginScreen onLogin={login} onNavigateRegister={() => navigate('register')} />;
            case 'register': return <LoginScreen onLogin={login} onNavigateRegister={() => navigate('login')} />; // Reusing LoginScreen for now as placeholder
            case 'onboarding': return <OnboardingScreen onComplete={handleOnboardingComplete} />;
            case 'home': return <HomeScreen user={user} navigate={navigate} />;
            case 'package': return <PackageScreen navigate={navigate} onSelectPackage={handleSelectPurchase} />;
            case 'topup': return <TopUpScreen navigate={navigate} onSelectPackage={handleSelectPurchase} />;
            case 'payment': return <PaymentScreen navigate={navigate} item={selectedPurchase} />;
            case 'shop': return <ShopScreen onSelectProduct={handleSelectProduct} />;
            case 'productDetail': return <ProductDetailScreen product={selectedProduct} navigate={navigate} />;
            case 'productCheckout': return <ProductCheckoutScreen product={selectedProduct} navigate={navigate} />;
            case 'history': return <HistoryScreen onSelectItem={handleSelectHistoryItem} />;
            case 'historyDetail': return <HistoryDetailScreen item={selectedHistoryItem} navigate={navigate} />;
            case 'profile': return <ProfileScreen user={user} onLogout={handleLogout} navigate={navigate} />;
            default: return <HomeScreen user={user} navigate={navigate} />;
        }
    };

    const showBottomNav = ['home', 'shop', 'history', 'profile', 'historyDetail', 'productDetail', 'productCheckout'].includes(currentScreen);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <View style={styles.content}>
                {renderScreen()}
            </View>
            {showBottomNav && (<BottomNav currentScreen={currentScreen} navigate={navigate} />)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    content: {
        flex: 1,
    }
});

export default App;
