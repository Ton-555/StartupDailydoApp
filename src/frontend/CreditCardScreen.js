import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Plus, CreditCard, Trash2 } from 'lucide-react-native';
import Header from './components/Header';
import MinimalInput from './components/MinimalInput';
import MinimalButton from './components/MinimalButton';
import { useTheme } from './context/ThemeContext';

const CreditCardScreen = ({ cards, onAddCard, onDeleteCard, navigate }) => {
    const { isDarkMode, colors } = useTheme();
    const [isAdding, setIsAdding] = useState(false);
    const [newCard, setNewCard] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

    const handleSave = () => {
        if (!newCard.cardNumber || !newCard.cardHolder || !newCard.expiryDate || !newCard.cvv) {
            Alert.alert('Validation Error', 'Please fill in required fields');
            return;
        }
        // Mask card number for display
        const last4 = newCard.cardNumber.slice(-4);
        onAddCard({ ...newCard, id: Date.now().toString(), last4 });
        setNewCard({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
        setIsAdding(false);
    };

    const renderItem = ({ item }) => (
        <View style={[styles.cardItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? colors.background : '#fafafa', borderColor: colors.border }]}>
                    <CreditCard size={20} color={colors.subText} />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={[styles.cardName, { color: colors.text }]}>**** **** **** {item.last4}</Text>
                    <Text style={[styles.cardDetail, { color: colors.subText }]}>{item.cardHolder}</Text>
                    <Text style={[styles.cardDetail, { color: colors.subText }]}>Expires: {item.expiryDate}</Text>
                </View>
            </View>
            {onDeleteCard && (
                <TouchableOpacity onPress={() => onDeleteCard(item.id)} style={styles.deleteButton}>
                    <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header
                title={isAdding ? "Add New Card" : "My Credit Cards"}
                onBack={() => {
                    if (isAdding) setIsAdding(false);
                    else navigate('profile');
                }}
                rightAction={
                    !isAdding && (
                        <TouchableOpacity onPress={() => setIsAdding(true)}>
                            <Plus size={24} color={colors.text} />
                        </TouchableOpacity>
                    )
                }
            />

            <View style={styles.content}>
                {isAdding ? (
                    <ScrollView contentContainerStyle={styles.formContainer}>
                        <MinimalInput
                            label="Card Number"
                            placeholder="0000 0000 0000 0000"
                            value={newCard.cardNumber}
                            onChange={(text) => setNewCard({ ...newCard, cardNumber: text })}
                            keyboardType="numeric"
                        />
                        <MinimalInput
                            label="Card Holder Name"
                            placeholder="John Doe"
                            value={newCard.cardHolder}
                            onChange={(text) => setNewCard({ ...newCard, cardHolder: text })}
                        />
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <MinimalInput
                                    label="Expiry Date"
                                    placeholder="MM/YY"
                                    value={newCard.expiryDate}
                                    onChange={(text) => setNewCard({ ...newCard, expiryDate: text })}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <MinimalInput
                                    label="CVV"
                                    placeholder="123"
                                    value={newCard.cvv}
                                    onChange={(text) => setNewCard({ ...newCard, cvv: text })}
                                    keyboardType="numeric"
                                    type="password"
                                />
                            </View>
                        </View>

                        <View style={styles.actionButtons}>
                            <MinimalButton variant="primary" onClick={handleSave} fullWidth>
                                Save Card
                            </MinimalButton>
                        </View>
                    </ScrollView>
                ) : (
                    <>
                        <FlatList
                            data={cards}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.listContainer}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <CreditCard size={48} color={isDarkMode ? '#52525b' : '#e4e4e7'} />
                                    <Text style={[styles.emptyText, { color: colors.text }]}>No cards found</Text>
                                    <Text style={[styles.emptySubText, { color: colors.subText }]}>Add a credit card for faster checkout.</Text>
                                </View>
                            }
                        />
                        <View style={styles.fabContainer}>
                            <MinimalButton variant="primary" icon={Plus} onClick={() => setIsAdding(true)} fullWidth>
                                Add New Card
                            </MinimalButton>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    content: {
        flex: 1,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    formContainer: {
        padding: 16,
    },
    cardItem: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f4f4f5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fafafa',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#f4f4f5',
    },
    cardInfo: {
        flex: 1,
    },
    cardName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#18181b',
        marginBottom: 2,
    },
    cardDetail: {
        fontSize: 14,
        color: '#71717a',
    },
    deleteButton: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#3f3f46',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: '#a1a1aa',
        textAlign: 'center',
        marginTop: 8,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
    },
    row: {
        flexDirection: 'row',
    },
    actionButtons: {
        marginTop: 16,
    }
});

export default CreditCardScreen;