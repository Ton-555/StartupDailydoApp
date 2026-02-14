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
            users_id: userData.users_id,
            username: userData.username,
            email: userData.email || 'user@minimal.app',
            phone: userData.phone || '081-234-5678',
            fullName: (userData.first_name && userData.last_name)
                ? `${userData.first_name} ${userData.last_name}`
                : userData.username,
            idMember: 'MB-' + (userData.users_id % 10000).toString().padStart(4, '0'),
            coins: userData.coin_balance || 0
        });
        refreshCards(userData.users_id);
        refreshAddress(userData.users_id);
        navigate('home');
    };

    const register = (userData) => {
        setUser({
            users_id: userData.users_id,
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

    const refreshUser = async (directData = null) => {
        if (directData) {
            console.log('[refreshUser] Using direct data:', directData.coin_balance);
            setUser(prev => {
                if (!prev) return null;
                const updated = {
                    ...prev,
                    fullName: (directData.first_name && directData.last_name)
                        ? `${directData.first_name} ${directData.last_name}`
                        : (directData.first_name || directData.username || prev.username),
                    coins: Number(directData.coin_balance ?? prev.coins),
                    email: directData.email || prev.email,
                    phone: directData.phone || prev.phone
                };
                return updated;
            });
            return;
        }

        if (!user || !user.users_id) {
            console.log('[refreshUser] No user or users_id found', user);
            return;
        }

        try {
            const API_BASE = 'http://10.0.2.2:3000';
            console.log(`[refreshUser] Fetching latest data for user: ${user.users_id}`);
            const response = await fetch(`${API_BASE}/users/id/${user.users_id}?t=${Date.now()}`);
            const result = await response.json();

            if (result.success && result.data) {
                const userData = result.data;
                console.log(`[refreshUser] Fetched coin_balance: ${userData.coin_balance}`);

                setUser(prev => {
                    if (!prev) return null;
                    const updated = {
                        ...prev,
                        fullName: (userData.first_name && userData.last_name)
                            ? `${userData.first_name} ${userData.last_name}`
                            : (userData.first_name || userData.username || prev.username),
                        coins: Number(userData.coin_balance ?? prev.coins),
                        email: userData.email || prev.email,
                        phone: userData.phone || prev.phone
                    };
                    console.log(`[refreshUser] State updated. New coins: ${updated.coins}`);
                    return updated;
                });
            } else {
                console.log('[refreshUser] Failed to fetch user data', result);
            }
        } catch (error) {
            console.error('[refreshUser] Error:', error);
        }
    };

    const handleSelectPurchase = (item) => { setSelectedPurchase(item); navigate('payment'); };
    const handleSelectHistoryItem = (item) => { setSelectedHistoryItem(item); navigate('historyDetail'); };
    const handleSelectProduct = (product) => { setSelectedProduct(product); navigate('productDetail'); };

    const refreshAddress = async (userId = user?.users_id) => {
        if (!userId) return;
        try {
            const API_BASE = 'http://10.0.2.2:3000';
            const res = await fetch(`${API_BASE}/address/get-address/${userId}`);
            const json = await res.json();
            if (json.success && json.address) {
                // If the user wants plain text, we store it as a single address object in the array
                // where the houseNo holds the full text for display, or we try to keep the structure.
                // However, the user asked to SAVE as text. 
                // Let's assume the UI still wants the fields if possible, but if it comes back as one string, 
                // we'll put it in houseNo.
                setAddresses([{
                    id: '1',
                    name: 'Saved Address',
                    houseNo: json.address,
                    city: '',
                    street: '',
                    zip: ''
                }]);
            } else {
                setAddresses([]);
            }
        } catch (err) {
            console.error('Error fetching address:', err);
        }
    };

    const handleAddAddress = async (addressObj) => {
        if (!user || !user.users_id) return;
        try {
            const API_BASE = 'http://10.0.2.2:3000';
            // Format object to plain text string: "123/45 Sukhumvit Road, Bangkok, 10110"
            const addressString = `${addressObj.houseNo} ${addressObj.street}, ${addressObj.city}, ${addressObj.zip}`.trim();

            const res = await fetch(`${API_BASE}/address/add-address`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    users_id: user.users_id,
                    address: addressString
                })
            });
            const json = await res.json();
            if (json.success) {
                refreshAddress();
            }
        } catch (err) {
            console.error('Error adding address:', err);
        }
    };

    const handleUpdateAddress = async (updatedAddressObj) => {
        if (!user || !user.users_id) return;
        try {
            const API_BASE = 'http://10.0.2.2:3000';
            const addressString = `${updatedAddressObj.houseNo} ${updatedAddressObj.street}, ${updatedAddressObj.city}, ${updatedAddressObj.zip}`.trim();

            const res = await fetch(`${API_BASE}/address/edit-address`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    users_id: user.users_id,
                    address: addressString
                })
            });
            const json = await res.json();
            if (json.success) {
                refreshAddress();
            }
        } catch (err) {
            console.error('Error updating address:', err);
        }
    };

    const handleDeleteAddress = async () => {
        if (!user || !user.users_id) return;
        try {
            const API_BASE = 'http://10.0.2.2:3000';
            const res = await fetch(`${API_BASE}/address/delete-address`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ users_id: user.users_id })
            });
            const json = await res.json();
            if (json.success) {
                setAddresses([]);
            }
        } catch (err) {
            console.error('Error deleting address:', err);
        }
    };

    const refreshCards = async (userId = user?.users_id) => {
        if (!userId) return;
        try {
            const API_BASE = 'http://10.0.2.2:3000';
            const res = await fetch(`${API_BASE}/payment/user/${userId}`);
            const json = await res.json();
            if (json.success) {
                const mappedCards = json.data.map(c => ({
                    id: c.id,
                    cardNumber: c.number_card,
                    cardHolder: c.name_card,
                    expiryDate: c.expiration_date,
                    cvv: c.cvv,
                    last4: c.number_card ? c.number_card.slice(-4) : '****'
                }));
                setCards(mappedCards);
            }
        } catch (err) {
            console.error('Error fetching cards:', err);
        }
    };

    const handleAddCard = async (cardData) => {
        if (!user || !user.users_id) return;
        try {
            const API_BASE = 'http://10.0.2.2:3000';
            const res = await fetch(`${API_BASE}/payment/addcreditcard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    users_id: user.users_id,
                    number_card: cardData.cardNumber,
                    name_card: cardData.cardHolder,
                    expiration_date: cardData.expiryDate,
                    cvv: cardData.cvv,
                    omise_customer_id: '' // Optional for now
                })
            });
            const json = await res.json();
            if (json.success) {
                refreshCards();
            }
        } catch (err) {
            console.error('Error adding card:', err);
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (!user || !user.users_id) return;
        try {
            const API_BASE = 'http://10.0.2.2:3000';
            const res = await fetch(`${API_BASE}/payment/deletecard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    users_id: user.users_id,
                    id_card: cardId
                })
            });
            const json = await res.json();
            if (json.success) {
                refreshCards();
            }
        } catch (err) {
            console.error('Error deleting card:', err);
        }
    };

    return {
        currentScreen, user, navigate, login, register, handleOnboardingComplete, handleLogout,
        handleSelectPurchase, handleSelectHistoryItem, handleSelectProduct,
        selectedPurchase, selectedHistoryItem, selectedProduct,
        addresses, handleAddAddress, handleUpdateAddress, handleDeleteAddress,
        cards, handleAddCard, handleDeleteCard, refreshUser
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
        cards, handleAddCard, handleDeleteCard, refreshUser
    } = useAppLogic();

    const theme = useTheme();

    const renderScreen = () => {
        switch (currentScreen) {
            case 'login': return <LoginScreen onLogin={login} onNavigateRegister={() => navigate('register')} />;
            case 'register': return <RegisterScreen onRegister={register} onNavigateLogin={() => navigate('login')} />;
            case 'onboarding': return <OnboardingScreen onComplete={handleOnboardingComplete} />;
            case 'home': return <HomeScreen user={user} navigate={navigate} onRefreshUser={refreshUser} />;
            case 'package': return <PackageScreen navigate={navigate} onSelectPackage={handleSelectPurchase} />;
            case 'topup': return <TopUpScreen navigate={navigate} onSelectPackage={handleSelectPurchase} onRefreshUser={refreshUser} />;
            case 'payment': return <PaymentScreen navigate={navigate} item={selectedPurchase} user={user} onRefreshUser={refreshUser} cards={cards} />;
            case 'shop': return <ShopScreen onSelectProduct={handleSelectProduct} />;
            case 'productDetail': return <ProductDetailScreen product={selectedProduct} navigate={navigate} />;
            case 'productCheckout': return <ProductCheckoutScreen product={selectedProduct} navigate={navigate} user={user} onRefreshUser={refreshUser} />;
            case 'history': return <HistoryScreen onSelectItem={handleSelectHistoryItem} user={user} />; // [Added] user={user} prop for fetch history // [Added] user={user} prop for fetch history
            case 'historyDetail': return <HistoryDetailScreen item={selectedHistoryItem} navigate={navigate} />;
            case 'profile': return <ProfileScreen user={user} onLogout={handleLogout} navigate={navigate} />;
            case 'address': return <AddressScreen addresses={addresses} onAddAddress={handleAddAddress} onUpdateAddress={handleUpdateAddress} onDeleteAddress={handleDeleteAddress} navigate={navigate} />;
            case 'creditcard': return <CreditCardScreen cards={cards} onAddCard={handleAddCard} onDeleteCard={handleDeleteCard} navigate={navigate} />;
            case 'settings': return <SettingsScreen user={user} navigate={navigate} onRefreshUser={refreshUser} />;
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
