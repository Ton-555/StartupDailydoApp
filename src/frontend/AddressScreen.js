import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';

import { Plus, MapPin, Trash2, Pencil } from 'lucide-react-native';
import Header from './components/Header';
import MinimalInput from './components/MinimalInput';
import MinimalButton from './components/MinimalButton';

const AddressScreen = ({ addresses, onAddAddress, onUpdateAddress, navigate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newAddress, setNewAddress] = useState({
        name: '',
        houseNo: '',
        street: '',
        city: '',
        zip: ''
    });

    const handleSave = () => {
        if (!newAddress.name || !newAddress.houseNo || !newAddress.city) {
            // Basic validation
            alert('Please fill in required fields');
            return;
        }

        if (editingId) {
            onUpdateAddress({ ...newAddress, id: editingId });
        } else {
            onAddAddress({ ...newAddress, id: Date.now().toString() });
        }

        setNewAddress({ name: '', houseNo: '', street: '', city: '', zip: '' });
        setEditingId(null);
        setIsAdding(false);
    };

    const handleEdit = (item) => {
        setNewAddress(item);
        setEditingId(item.id);
        setIsAdding(true);
    };

    const renderItem = ({ item }) => (
        <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
                <View style={styles.iconContainer}>
                    <MapPin size={20} color="#52525b" />
                </View>
                <View style={styles.addressInfo}>
                    <Text style={styles.addressName}>{item.name}</Text>
                    <Text style={styles.addressDetail}>
                        {item.houseNo} {item.street}
                    </Text>
                    <Text style={styles.addressDetail}>
                        {item.city}, {item.zip}
                    </Text>
                </View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconButton}>
                    <Pencil size={18} color="#52525b" />
                </TouchableOpacity>

            </View>
        </View >
    );

    return (
        <View style={styles.container}>
            <Header
                title={isAdding ? (editingId ? "Edit Address" : "Add New Address") : "My Addresses"}
                onBack={() => {
                    if (isAdding) {
                        setIsAdding(false);
                        setEditingId(null);
                        setNewAddress({ name: '', houseNo: '', street: '', city: '', zip: '' });
                    }
                    else navigate('profile');
                }}
                rightAction={
                    !isAdding && (
                        <TouchableOpacity onPress={() => setIsAdding(true)}>
                            <Plus size={24} color="#18181b" />
                        </TouchableOpacity>
                    )
                }
            />

            <View style={styles.content}>
                {isAdding ? (
                    <ScrollView contentContainerStyle={styles.formContainer}>
                        <MinimalInput
                            label="Location Name (e.g. Home, Office)"
                            placeholder="Home"
                            value={newAddress.name}
                            onChange={(text) => setNewAddress({ ...newAddress, name: text })}
                        />
                        <MinimalInput
                            label="House No. / Building"
                            placeholder="123/45"
                            value={newAddress.houseNo}
                            onChange={(text) => setNewAddress({ ...newAddress, houseNo: text })}
                        />
                        <MinimalInput
                            label="Street / Road"
                            placeholder="Sukhumvit Road"
                            value={newAddress.street}
                            onChange={(text) => setNewAddress({ ...newAddress, street: text })}
                        />
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <MinimalInput
                                    label="City"
                                    placeholder="Bangkok"
                                    value={newAddress.city}
                                    onChange={(text) => setNewAddress({ ...newAddress, city: text })}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <MinimalInput
                                    label="Zip Code"
                                    placeholder="10110"
                                    value={newAddress.zip}
                                    onChange={(text) => setNewAddress({ ...newAddress, zip: text })}
                                />
                            </View>
                        </View>

                        <View style={styles.actionButtons}>
                            <MinimalButton variant="primary" onClick={handleSave} fullWidth>
                                Save Address
                            </MinimalButton>
                        </View>
                    </ScrollView>
                ) : (
                    <>
                        <FlatList
                            data={addresses}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.listContainer}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <MapPin size={48} color="#e4e4e7" />
                                    <Text style={styles.emptyText}>No addresses found</Text>
                                    <Text style={styles.emptySubText}>Add an address to manage your delivery locations.</Text>
                                </View>
                            }
                        />
                        <View style={styles.fabContainer}>
                            <MinimalButton variant="primary" icon={Plus} onClick={() => setIsAdding(true)} fullWidth>
                                Add New Address
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
    addressCard: {
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
    addressHeader: {
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
    addressInfo: {
        flex: 1,
    },
    addressName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#18181b',
        marginBottom: 2,
    },
    addressDetail: {
        fontSize: 14,
        color: '#71717a',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconButton: {
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

export default AddressScreen;
