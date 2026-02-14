import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { User, Mail, Phone, CreditCard, Calendar } from 'lucide-react-native';
import Header from './components/Header';
import { useTheme } from './context/ThemeContext';

const SettingsScreen = ({ user, navigate, onRefreshUser }) => {
    const { isDarkMode, colors } = useTheme();
    const [editing, setEditing] = useState(false);
    const [editingField, setEditingField] = useState(null); // Track which field is being edited
    const [showModal, setShowModal] = useState(false);
    const [fullNameInput, setFullNameInput] = useState(user?.fullName || `${user?.first_name || ''}${user?.last_name ? ' ' + user.last_name : ''}`.trim());
    const [emailInput, setEmailInput] = useState(user?.email || '');
    const [phoneInput, setPhoneInput] = useState(user?.phone || '');
    const [saving, setSaving] = useState(false);

    const API_BASE = 'http://10.0.2.2:3000'; // change if backend hosted elsewhere

    const startEdit = (field) => {
        setEditingField(field);
        if (field === 'fullname') {
            setFullNameInput(user?.fullName || `${user?.first_name || ''}${user?.last_name ? ' ' + user.last_name : ''}`.trim());
        } else if (field === 'email') {
            setEmailInput(user?.email || '');
        } else if (field === 'phone') {
            setPhoneInput(user?.phone || '');
        }
        setShowModal(true);
        setEditing(true);
    };

    const cancelEdit = () => {
        setFullNameInput(user?.fullName || `${user?.first_name || ''}${user?.last_name ? ' ' + user.last_name : ''}`.trim());
        setEmailInput(user?.email || '');
        setPhoneInput(user?.phone || '');
        setEditing(false);
        setEditingField(null);
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
            setShowModal(false);
        } catch (err) {
            console.error('Update fullname error:', err);
            Alert.alert('Error', err.message || String(err));
        } finally {
            setSaving(false);
        }
    };

    const handleSaveEmail = async () => {
        console.log('Saving email...', { userId: user?.users_id, email: emailInput });
        
        const userId = user?.users_id || user?.id_user;
        if (!userId) {
            Alert.alert('Error', 'Missing user id');
            return;
        }

        const raw = (emailInput || '').trim().toLowerCase();
        if (!raw) {
            Alert.alert('Validation', 'Please enter a valid email');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(raw)) {
            Alert.alert('Validation', 'Please enter a valid email format');
            return;
        }

        try {
            setSaving(true);
            const url = `${API_BASE}/users/${userId}/email`;
            console.log('API URL:', url);
            
            const res = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: raw }),
            });

            console.log('Response status:', res.status);
            const text = await res.text();
            console.log('Response text:', text);
            
            let json;
            try {
                json = JSON.parse(text);
            } catch (parseErr) {
                console.error('JSON parse error:', parseErr);
                throw new Error(`Server returned invalid JSON: ${text}`);
            }
            
            if (!res.ok || json.success === false) {
                throw new Error(json.message || `Failed to update email (Status: ${res.status})`);
            }

            if (onRefreshUser) await onRefreshUser();

            Alert.alert('Success', 'Email updated');
            setEditing(false);
            setShowModal(false);
        } catch (err) {
            console.error('Update email error:', err);
            Alert.alert('Error', err.message || String(err));
        } finally {
            setSaving(false);
        }
    };

    const handleSavePhone = async () => {
        console.log('Saving phone...', { userId: user?.users_id, phone: phoneInput });
        
        const userId = user?.users_id || user?.id_user;
        if (!userId) {
            Alert.alert('Error', 'Missing user id');
            return;
        }

        const raw = (phoneInput || '').trim();
        if (!raw) {
            Alert.alert('Validation', 'Please enter a valid phone number');
            return;
        }

        // Validate phone format (exactly 10 digits)
        const phoneDigitsOnly = raw.replace(/\D/g, '');
        if (phoneDigitsOnly.length !== 10) {
            Alert.alert('Validation', 'Phone number must contain exactly 10 digits (numbers only).');
            return;
        }

        try {
            setSaving(true);
            const url = `${API_BASE}/users/${userId}/phone`;
            console.log('API URL:', url);
            
            const res = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: raw }),
            });

            console.log('Response status:', res.status);
            const text = await res.text();
            console.log('Response text:', text);
            
            let json;
            try {
                json = JSON.parse(text);
            } catch (parseErr) {
                console.error('JSON parse error:', parseErr);
                throw new Error(`Server returned invalid JSON: ${text}`);
            }
            
            if (!res.ok || json.success === false) {
                throw new Error(json.message || `Failed to update phone (Status: ${res.status})`);
            }

            if (onRefreshUser) await onRefreshUser();

            Alert.alert('Success', 'Phone number updated');
            setEditing(false);
            setShowModal(false);
        } catch (err) {
            console.error('Update phone error:', err);
            Alert.alert('Error', err.message || String(err));
        } finally {
            setSaving(false);
        }
    };

    const getModalTitle = () => {
        switch (editingField) {
            case 'fullname':
                return 'Edit Full Name';
            case 'email':
                return 'Edit Email';
            case 'phone':
                return 'Edit Phone Number';
            default:
                return 'Edit';
        }
    };

    const getModalPlaceholder = () => {
        switch (editingField) {
            case 'fullname':
                return 'Type full name here';
            case 'email':
                return 'Type email here';
            case 'phone':
                return 'Type phone number here';
            default:
                return 'Type here';
        }
    };

    const getModalInputValue = () => {
        switch (editingField) {
            case 'fullname':
                return fullNameInput;
            case 'email':
                return emailInput;
            case 'phone':
                return phoneInput;
            default:
                return '';
        }
    };

    const getModalInputOnChange = () => {
        switch (editingField) {
            case 'fullname':
                return setFullNameInput;
            case 'email':
                return setEmailInput;
            case 'phone':
                return setPhoneInput;
            default:
                return () => { };
        }
    };

    const handleModalSave = () => {
        switch (editingField) {
            case 'fullname':
                handleSaveFullname();
                break;
            case 'email':
                handleSaveEmail();
                break;
            case 'phone':
                handleSavePhone();
                break;
            default:
                break;
        }
    };

    const InfoRow = ({ icon: Icon, label, value, onEdit }) => (
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <View style={styles.infoLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? colors.background : '#fafafa' }]}>
                    <Icon size={20} color={colors.subText} />
                </View>
                <Text style={[styles.label, { color: colors.subText }]}>{label}</Text>
            </View>
            <TouchableOpacity onPress={onEdit} style={{ paddingHorizontal: 8 }}>
                <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Settings" onBack={() => navigate('profile')} />

            <ScrollView contentContainerStyle={styles.content}>
                <Modal visible={showModal} transparent animationType="fade" onRequestClose={cancelEdit}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>{getModalTitle()}</Text>
                            <TextInput
                                style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                value={getModalInputValue()}
                                onChangeText={getModalInputOnChange()}
                                placeholder={getModalPlaceholder()}
                                placeholderTextColor={colors.subText}
                                autoFocus
                                multiline={editingField === 'fullname'}
                                keyboardType={editingField === 'email' ? 'email-address' : editingField === 'phone' ? 'phone-pad' : 'default'}
                            />

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#10b981' }]} onPress={handleModalSave} disabled={saving}>
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

                        <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => startEdit('fullname')}>
                            <Text style={[styles.value, { color: colors.text }]}>{user?.fullName || `${user?.first_name || ''}${user?.last_name ? ' ' + user.last_name : ''}`.trim() || 'N/A'}</Text>
                        </TouchableOpacity>
                    </View>
                    <InfoRow icon={Mail} label="Email" value={user?.email || 'N/A'} onEdit={() => startEdit('email')} />
                    <InfoRow icon={Phone} label="Phone" value={user?.phone || 'N/A'} onEdit={() => startEdit('phone')} />
                    <InfoRow icon={CreditCard} label="Member ID" value={user?.idMember || 'N/A'} onEdit={() => { }} />
                    <InfoRow icon={Calendar} label="Username" value={user?.username || 'N/A'} onEdit={() => { }} />
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