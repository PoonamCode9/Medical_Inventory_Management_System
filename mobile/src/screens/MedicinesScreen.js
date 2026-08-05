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
import { CATEGORIES, catLabel } from '../constants';
import { COLORS } from '../theme';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import TextField from '../components/TextField';
import AppButton from '../components/AppButton';
import Select from '../components/Select';
import Badge from '../components/Badge';

const BASE = (role) => (role === 'PHARMACIST' ? '/api/pharmacy' : '/api/admin');
const canManage = (role) => role === 'ADMIN' || role === 'PHARMACIST';

const emptyForm = { name: '', description: '', category: '' };

export default function MedicinesScreen() {
  const { user } = useAuth();
  const role = user?.role;
  const [medicines, setMedicines] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const base = BASE(role);

  const load = useCallback(async () => {
    try {
      const q = search.trim();
      const medUrl = q ? `${base}/medicines/search?q=${encodeURIComponent(q)}` : `${base}/medicines`;
      const [mRes, iRes] = await Promise.all([
        api.get(medUrl),
        api.get(`${base}/inventory`),
      ]);
      setMedicines(mRes.data);
      setInventory(iRes.data);
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e, 'Failed to load medicines.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [base, search]);

  useEffect(() => { setLoading(true); load(); }, [load]);

  const stockOf = (id) => {
    const items = inventory.filter((i) => i.medicine?.id === id);
    const qty = items.reduce((s, i) => s + (i.available_qty || 0), 0);
    return { qty, batches: items.length };
  };

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setErrorMsg(''); setModalOpen(true); };
  const openEdit = (m) => { setEditingId(m.id); setForm({ name: m.name, description: m.description || '', category: m.category || '' }); setErrorMsg(''); setModalOpen(true); };

  const save = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = { ...form, category: form.category || null };
      const url = editingId ? `/api/admin/medicines/${editingId}` : '/api/admin/medicines';
      await api[editingId ? 'put' : 'post'](url, payload);
      setModalOpen(false);
      load();
    } catch (e) {
      setErrorMsg(getErrorMessage(e, 'Failed to save medicine.'));
    } finally {
      setSaving(false);
    }
  };

  const remove = (m) => {
    Alert.alert('Delete medicine?', 'Linked stock and transactions are removed too.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/admin/medicines/${m.id}`);
            load();
          } catch (e) {
            Alert.alert('Error', getErrorMessage(e, 'Failed to delete medicine.'));
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const stock = stockOf(item.id);
    const stockColor = stock.qty === 0 ? COLORS.danger : stock.qty < 15 ? COLORS.warning : COLORS.success;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Badge text={catLabel(item.category)} color={COLORS.violet} bg={COLORS.violetBg} border={COLORS.violetBg} />
        </View>
        <View style={styles.stockRow}>
          <Text style={[styles.stockBadge, { color: stockColor, backgroundColor: stockColor + '1a' }]}>
            {stock.qty} units in stock
          </Text>
          <Text style={styles.stockMeta}>{stock.batches} batch{stock.batches !== 1 ? 'es' : ''}</Text>
        </View>
        {item.description ? <Text style={styles.desc} numberOfLines={3}>{item.description}</Text> : null}
        {canManage(role) && (
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(item)}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => remove(item)}>
              <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.flex}>
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search medicines..."
          placeholderTextColor={COLORS.faint}
        />
      </View>

      {loading ? <Loading /> : medicines.length === 0 ? (
        <EmptyState title={search ? 'No matching medicines' : 'No medicines yet'} subtitle={canManage(role) ? 'Tap + to add your first medicine.' : 'No medicines available.'} />
      ) : (
        <FlatList
          data={medicines}
          keyExtractor={(m) => String(m.id)}
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
            <Text style={styles.modalTitle}>{editingId ? 'Edit Medicine' : 'Add Medicine'}</Text>
            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
            <ScrollView keyboardShouldPersistTaps="handled">
              <TextField label="Medicine Name" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="e.g. Paracetamol 500mg" />
              <Select
                label="Therapeutic Category"
                value={form.category}
                options={CATEGORIES}
                onChange={(c) => setForm({ ...form, category: c })}
              />
              <TextField label="Clinical Description / Formula Details" value={form.description} onChangeText={(t) => setForm({ ...form, description: t })} placeholder="Usage, strength, warnings..." multiline />
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <AppButton style={{ flex: 1.6 }} title={saving ? 'Saving...' : 'Save Medicine'} onPress={save} disabled={saving || !form.name.trim()} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = {
  flex: { flex: 1, backgroundColor: COLORS.bg },
  searchWrap: { padding: 16, paddingBottom: 4 },
  search: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  list: { paddingHorizontal: 16, paddingBottom: 96 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text, flex: 1, marginRight: 8 },
  stockRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  stockBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, fontSize: 12, fontWeight: '800', overflow: 'hidden' },
  stockMeta: { fontSize: 12, color: COLORS.faint, marginLeft: 8 },
  desc: { fontSize: 13, color: COLORS.muted, marginTop: 10, lineHeight: 18 },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginLeft: 8 },
  deleteBtn: { backgroundColor: COLORS.dangerBg },
  actionText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  deleteText: { color: COLORS.danger },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '700', lineHeight: 32 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end' },
  modalScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.5)' },
  modalSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  error: { backgroundColor: COLORS.dangerBg, color: COLORS.danger, borderRadius: 10, padding: 10, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: COLORS.muted, fontWeight: '700' },
};
