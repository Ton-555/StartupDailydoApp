import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import LoginScreen from './src/frontend/LoginScreen';
import RegisterScreen from './src/frontend/RegisterScreen';
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
import SettingsScreen from './src/frontend/SettingsScreen';

// Context
import { ThemeProvider, useTheme } from './src/frontend/context/ThemeContext';

// Components
import BottomNav from './src/frontend/components/BottomNav';

const useAppLogic = () => {
    const [currentScreen, setCurrentScreen] = useState('login');
    const [user, setUser] = useState(null);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [cards, setCards] = useState([]);

    const navigate = (screen) => setCurrentScreen(screen);

    const login = (userData) => {
        setUser({
            username: userData.username,
            email: userData.email || 'user@minimal.app',
            phone: userData.phone || '081-234-5678',
            fullName: (userData.first_name && userData.last_name)
                ? `${userData.first_name} ${userData.last_name}`
                : userData.username,
            idMember: 'MB-' + (userData.id % 10000).toString().padStart(4, '0'),
            coins: userData.coin_balance || 0
        });
        navigate('home'); // Login สำเร็จไปหน้า Home เลย (หรือ onboarding ตามต้องการ)
    };

    const register = (userData) => {
        setUser({
            username: userData.username,
            email: userData.email || 'user@minimal.app',
            phone: userData.phone || '081-234-5678',
            fullName: userData.fullName || userData.username,
            idMember: 'MB-' + Math.floor(1000 + Math.random() * 9000),
            coins: 0
        });
        navigate('onboarding');
    };

    const handleOnboardingComplete = () => navigate('home');
    const handleLogout = () => { setUser(null); navigate('login'); };
    const handleSelectPurchase = (item) => { setSelectedPurchase(item); navigate('payment'); };
    const handleSelectHistoryItem = (item) => { setSelectedHistoryItem(item); navigate('historyDetail'); };
    const handleSelectProduct = (product) => { setSelectedProduct(product); navigate('productDetail'); };

    const handleAddAddress = (address) => setAddresses([...addresses, address]);
    const handleUpdateAddress = (updatedAddress) => {
        setAddresses(addresses.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr));
    };
    const handleDeleteAddress = (id) => setAddresses(addresses.filter(addr => addr.id !== id));

    const handleAddCard = (card) => setCards([...cards, card]);
    const handleDeleteCard = (id) => setCards(cards.filter(card => card.id !== id));

    return {
        currentScreen, user, navigate, login, register, handleOnboardingComplete, handleLogout,
        handleSelectPurchase, handleSelectHistoryItem, handleSelectProduct,
        selectedPurchase, selectedHistoryItem, selectedProduct,
        addresses, handleAddAddress, handleUpdateAddress, handleDeleteAddress,
        cards, handleAddCard, handleDeleteCard
    };
};

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

const AppContent = () => {
    const {
        currentScreen, user, navigate, login, register, handleOnboardingComplete, handleLogout,
        handleSelectPurchase, handleSelectHistoryItem, handleSelectProduct,
        selectedPurchase, selectedHistoryItem, selectedProduct,
        addresses, handleAddAddress, handleUpdateAddress, handleDeleteAddress,
        cards, handleAddCard, handleDeleteCard
    } = useAppLogic();

    const theme = useTheme();

    const renderScreen = () => {
        switch (currentScreen) {
            case 'login': return <LoginScreen onLogin={login} onNavigateRegister={() => navigate('register')} />;
            case 'register': return <RegisterScreen onRegister={register} onNavigateLogin={() => navigate('login')} />;
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
            case 'address': return <AddressScreen addresses={addresses} onAddAddress={handleAddAddress} onUpdateAddress={handleUpdateAddress} navigate={navigate} />;
            case 'creditcard': return <CreditCardScreen cards={cards} onAddCard={handleAddCard} onDeleteCard={handleDeleteCard} navigate={navigate} />;
            case 'settings': return <SettingsScreen user={user} navigate={navigate} />;
            default: return <HomeScreen user={user} navigate={navigate} />;
        }
    };

    const showBottomNav = ['home', 'shop', 'history', 'profile', 'historyDetail', 'productDetail', 'productCheckout', 'address', 'creditcard', 'settings'].includes(currentScreen);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
                <StatusBar barStyle={theme.isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
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
