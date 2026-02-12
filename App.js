import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import LoginScreen from './src/frontend/LoginScreen';
import OnboardingScreen from './src/frontend/OnboardingScreen';
import HomeScreen from './src/frontend/HomeScreen';
import PackageScreen from './src/frontend/PackageScreen';
import TopUpScreen from './src/frontend/TopUpScreen';
import PaymentScreen from './src/frontend/PaymentScreen';
import ShopScreen from './src/frontend/ShopScreen';
import ProductDetailScreen from './src/frontend/ProductDetailScreen';
import ProductCheckoutScreen from './src/frontend/ProductCheckoutScreen';
import HistoryScreen from './src/frontend/HistoryScreen';
import HistoryDetailScreen from './src/frontend/HistoryDetailScreen';
import ProfileScreen from './src/frontend/ProfileScreen';
import AddressScreen from './src/frontend/AddressScreen';
import CreditCardScreen from './src/frontend/CreditCardScreen';

// Components
import BottomNav from './src/frontend/components/BottomNav';

function App() {
    // --- State Management ---
    const [currentScreen, setCurrentScreen] = useState('login');
    const [user, setUser] = useState(null);

    // Data passing states
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [creditCards, setCreditCards] = useState([]);

    // --- Navigation Handler ---
    const navigate = (screen) => {
        setCurrentScreen(screen);
    };

    // --- Authentication Handlers ---
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

    // --- Feature Handlers ---
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

    const addAddress = (newAddress) => {
        setAddresses([...addresses, newAddress]);
    };

    const updateAddress = (updatedAddress) => {
        setAddresses(addresses.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr));
    };

    const deleteAddress = (id) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
    };

    const addCreditCard = (newCard) => {
        setCreditCards([...creditCards, newCard]);
    };

    const deleteCreditCard = (id) => {
        setCreditCards(creditCards.filter(card => card.id !== id));
    };

    // --- Screen Rendering Logic ---
    const renderScreen = () => {
        switch (currentScreen) {
            case 'login': return <LoginScreen onLogin={login} onNavigateRegister={() => navigate('register')} />;
            case 'register': return <LoginScreen onLogin={login} onNavigateRegister={() => navigate('login')} />; // Reusing LoginScreen for now
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
            case 'address': return <AddressScreen addresses={addresses} onAddAddress={addAddress} onUpdateAddress={updateAddress} onDeleteAddress={deleteAddress} navigate={navigate} />;
            case 'creditCard': return <CreditCardScreen cards={creditCards} onAddCard={addCreditCard} onDeleteCard={deleteCreditCard} navigate={navigate} />;
            default: return <HomeScreen user={user} navigate={navigate} />;
        }
    };

    // Bottom Navigation Visibility Logic
    const showBottomNav = ['home', 'shop', 'history', 'profile', 'historyDetail', 'productDetail', 'productCheckout', 'address', 'creditCard'].includes(currentScreen);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                <View style={styles.content}>
                    {renderScreen()}
                </View>
                {showBottomNav && (<BottomNav currentScreen={currentScreen} navigate={navigate} />)}
            </SafeAreaView>
        </SafeAreaProvider>
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
