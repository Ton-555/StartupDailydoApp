import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { User, Mail, Phone, CreditCard, Calendar } from 'lucide-react-native';
import Header from './components/Header';
import { useTheme } from './context/ThemeContext';

const SettingsScreen = ({ user, navigate, onRefreshUser }) => {
    const { isDarkMode, colors } = useTheme();
    const [editing, setEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fullNameInput, setFullNameInput] = useState(user?.fullName || `${user?.first_name || ''}${user?.last_name ? ' ' + user.last_name : ''}`.trim());
    const [saving, setSaving] = useState(false);

    const API_BASE = 'http://10.0.2.2:3000'; // change if backend hosted elsewhere

    const startEdit = () => {
        setShowModal(true);
        setEditing(true);
    };
    const cancelEdit = () => {
        setFullNameInput(user?.fullName || `${user?.first_name || ''}${user?.last_name ? ' ' + user.last_name : ''}`.trim());
        setEditing(false);
        setShowModal(false);
    };

    const handleSaveFullname = async () => {
        if (!user?.users_id) {
            Alert.alert('Error', 'Missing user id');
            return;
        }

        const raw = (fullNameInput || '').trim();
        if (!raw) {
            Alert.alert('Validation', 'Please enter a valid full name');
            return;
        }

        try {
            setSaving(true);

            const res = await fetch(`${API_BASE}/users/${user.users_id}/fullname`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: raw }),
            });

            const json = await res.json();
            if (!res.ok || json.success === false) {
                throw new Error(json.message || 'Failed to update name');
            }

            if (onRefreshUser) await onRefreshUser();

            Alert.alert('Success', 'Full name updated');
            setEditing(false);
            setShowModal(false); // also close modal
        } catch (err) {
            console.error('Update fullname error:', err);
            Alert.alert('Error', err.message || String(err));
        } finally {
            setSaving(false);
        }
    };

    const InfoRow = ({ icon: Icon, label, value }) => (
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <View style={styles.infoLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? colors.background : '#fafafa' }]}>
                    <Icon size={20} color={colors.subText} />
                </View>
                <Text style={[styles.label, { color: colors.subText }]}>{label}</Text>
            </View>
            <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Settings" onBack={() => navigate('profile')} />

            <ScrollView contentContainerStyle={styles.content}>
                <Modal visible={showModal} transparent animationType="fade" onRequestClose={cancelEdit}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Full Name</Text>
                            <TextInput
                                style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                value={fullNameInput}
                                onChangeText={setFullNameInput}
                                placeholder="Type full name here"
                                placeholderTextColor={colors.subText}
                                autoFocus
                                multiline
                            />

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#10b981' }]} onPress={handleSaveFullname} disabled={saving}>
                                    {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalButtonText}>Save</Text>}
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: 'transparent' }]} onPress={cancelEdit} disabled={saving}>
                                    <Text style={[styles.modalButtonText, { color: colors.subText }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* User Info Card */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>User Information</Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <View style={styles.infoLeft}>
                            <View style={[styles.iconBox, { backgroundColor: isDarkMode ? colors.background : '#fafafa' }]}>
                                <User size={20} color={colors.subText} />
                            </View>
                            <Text style={[styles.label, { color: colors.subText }]}>Full Name</Text>
                        </View>

                        <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={startEdit}>
                            <Text style={[styles.value, { color: colors.text }]}>{user?.fullName || `${user?.first_name || ''}${user?.last_name ? ' ' + user.last_name : ''}`.trim() || 'N/A'}</Text>
                        </TouchableOpacity>
                    </View>
                    <InfoRow icon={Mail} label="Email" value={user?.email || 'N/A'} />
                    <InfoRow icon={Phone} label="Phone" value={user?.phone || 'N/A'} />
                    <InfoRow icon={CreditCard} label="Member ID" value={user?.idMember || 'N/A'} />
                    <InfoRow icon={Calendar} label="Username" value={user?.username || 'N/A'} />
                </View>

                {/* Account Stats Card */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>Account Stats</Text>
                    </View>

                    <View style={[styles.statsRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.statsLabel, { color: colors.subText }]}>Current Coins</Text>
                        <Text style={[styles.statsValue, { color: '#f59e0b' }]}>{user?.coins?.toLocaleString() || '0'}</Text>
                    </View>
                </View>

                {/* App Info */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>App Information</Text>
                    </View>

                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.label, { color: colors.subText }]}>Version</Text>
                        <Text style={[styles.value, { color: colors.text }]}>1.0.0</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.label, { color: colors.subText }]}>Build</Text>
                        <Text style={[styles.value, { color: colors.text }]}>2024.02.13</Text>
                    </View>
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
    content: {
        padding: 16,
        gap: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f4f4f5',
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f5',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#18181b',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f5',
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconBox: {
        padding: 8,
        backgroundColor: '#fafafa',
        borderRadius: 8,
    },
    label: {
        fontSize: 14,
        color: '#71717a',
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: '#18181b',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    statsLabel: {
        fontSize: 14,
        color: '#71717a',
    },
    statsValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f59e0b',
    },
    editContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minWidth: 180,
        justifyContent: 'flex-end',
    },
    input: {
        minWidth: 140,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    saveButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    cancelButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    cancelText: {
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalBox: {
        width: '100%',
        maxWidth: 640,
        borderRadius: 12,
        padding: 20,
        elevation: 6,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    modalInput: {
        minHeight: 120,
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        textAlignVertical: 'top',
        backgroundColor: 'transparent',
        marginBottom: 12,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    modalButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default SettingsScreen;