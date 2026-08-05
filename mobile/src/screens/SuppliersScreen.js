import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api, getErrorMessage } from '../api/client';
import { formatDate } from '../constants';
import { COLORS } from '../theme';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import TextField from '../components/TextField';
import AppButton from '../components/AppButton';
import DateField from '../components/DateField';

const canManage = (role) => role === 'ADMIN' || role === 'PHARMACIST';

const emptyForm = { name: '', address: '', joinedfrom: new Date(), contact: '', email: '' };

export default function SuppliersScreen() {
  const { user } = useAuth();
  const role = user?.role;
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const load = useCallback(async () => {
    try {
      const url = search.trim()
        ? `/api/admin/suppliers/search?q=${encodeURIComponent(search.trim())}`
        : '/api/admin/suppliers';
      const { data } = await api.get(url);
      setSuppliers(data);
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e, 'Failed to load suppliers.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditingId(null); setForm({ ...emptyForm }); setErrorMsg(''); setModalOpen(true); };

  const openEdit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name || '',
      address: s.address || '',
      joinedfrom: s.joinedfrom ? new Date(s.joinedfrom) : new Date(),
      contact: String(s.contact ?? ''),
      email: s.email || '',
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        name: form.name,
        address: form.address,
        joinedfrom: form.joinedfrom ? toLocalIso(form.joinedfrom) : null,
        contact: parseInt(form.contact, 10) || 0,
        email: form.email,
      };
      const url = editingId ? `/api/admin/suppliers/${editingId}` : '/api/admin/suppliers';
      await api[editingId ? 'put' : 'post'](url, payload);
      setModalOpen(false);
      load();
    } catch (e) {
      setErrorMsg(getErrorMessage(e, 'Failed to save supplier.'));
    } finally {
      setSaving(false);
    }
  };

  const remove = (s) => {
    Alert.alert('Delete supplier?', `${s.name} will be removed permanently.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/admin/suppliers/${s.id}`);
            load();
          } catch (e) {
            Alert.alert('Error', getErrorMessage(e, 'Failed to delete.'));
          }
        },
      },
    ]);
  };

  const renderItem = ({ item: s }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{s.name}</Text>
      <View style={styles.infoRow}><Text style={styles.label}>Email</Text><Text style={[styles.value, styles.left]}>{s.email}</Text></View>
      <View style={styles.infoRow}><Text style={styles.label}>Address</Text><Text style={[styles.value, styles.left]}>{s.address}</Text></View>
      <View style={styles.infoRow}><Text style={styles.label}>Contact</Text><Text style={styles.value}>+{s.contact}</Text></View>
      <View style={styles.infoRow}><Text style={styles.label}>Partner since</Text><Text style={styles.value}>{formatDate(s.joinedfrom)}</Text></View>
      {canManage(role) && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(s)}><Text style={styles.editText}>Edit</Text></TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(s)}><Text style={styles.deleteText}>Delete</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );

  const ready = form.name.trim() && form.address.trim() && form.email.trim() && form.contact.trim();

  return (
    <View style={styles.flex}>
      <View style={styles.searchWrap}>
        <TextInput style={styles.search} value={search} onChangeText={setSearch} placeholder="Search suppliers..." placeholderTextColor={COLORS.faint} />
      </View>

      {loading ? <Loading color={COLORS.info} /> : suppliers.length === 0 ? (
        <EmptyState title={search ? 'No matching suppliers' : 'No suppliers yet'} subtitle={canManage(role) ? 'Tap + to add your first vendor.' : 'No suppliers available.'} />
      ) : (
        <FlatList
          data={suppliers}
          keyExtractor={(s) => String(s.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        />
      )}

      {canManage(role) && (
        <TouchableOpacity style={styles.fab} onPress={openAdd} activeOpacity={0.85}>
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalOpen} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.modalScrim} onPress={() => setModalOpen(false)} />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Supplier' : 'New Supplier'}</Text>
            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
            <ScrollView keyboardShouldPersistTaps="handled">
              <TextField label="Supplier Name *" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="e.g. MediTrade Ltd" />
              <TextField label="Address *" value={form.address} onChangeText={(t) => setForm({ ...form, address: t })} placeholder="Full address" multiline />
              <TextField label="Email *" value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} placeholder="vendor@company.com" keyboardType="email-address" autoCapitalize="none" />
              <TextField label="Contact Number *" value={form.contact} onChangeText={(t) => setForm({ ...form, contact: t })} placeholder="e.g. 123456789" keyboardType="number-pad" />
              <DateField label="Partner Since *" value={form.joinedfrom} onChange={(d) => setForm({ ...form, joinedfrom: d })} />
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <AppButton style={{ flex: 1.6 }} title={saving ? 'Saving...' : editingId ? 'Update' : 'Add Supplier'} onPress={save} disabled={saving || !ready} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const toLocalIso = (d) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const styles = {
  flex: { flex: 1, backgroundColor: COLORS.bg },
  searchWrap: { padding: 16, paddingBottom: 4 },
  search: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.card, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: COLORS.text },
  list: { paddingHorizontal: 16, paddingBottom: 96 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16, marginBottom: 12 },
  name: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginBottom: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', marginRight: 10 },
  value: { fontSize: 13, fontWeight: '600', color: COLORS.text, textAlign: 'right', flex: 1 },
  left: { textAlign: 'left' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  editBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginRight: 8 },
  deleteBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: COLORS.dangerBg },
  editText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  deleteText: { fontSize: 13, fontWeight: '700', color: COLORS.danger },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: COLORS.info, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '700', lineHeight: 32 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end' },
  modalScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.5)' },
  modalSheet: { backgroundColor: COLORS.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32, maxHeight: '92%' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  error: { backgroundColor: COLORS.dangerBg, color: COLORS.danger, borderRadius: 10, padding: 10, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: COLORS.muted, fontWeight: '700' },
};
