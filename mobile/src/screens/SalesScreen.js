import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { CATEGORIES, formatDate, toApiDate } from '../constants';
import { COLORS } from '../theme';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import TextField from '../components/TextField';
import AppButton from '../components/AppButton';
import Select from '../components/Select';
import DateField from '../components/DateField';
import Badge from '../components/Badge';

const canManage = (role) => role === 'ADMIN' || role === 'PHARMACIST';

const emptyForm = {
  type: 'PURCHASE',
  medicineId: '',
  batch: '',
  quantity: '',
  amount: '',
  date: null,
  supplierId: '',
  manufacturing_date: null,
  expiration_date: null,
  newMedicineName: '',
  newMedicineCategory: '',
  newMedicineDescription: '',
};

export default function SalesScreen() {
  const { user } = useAuth();
  const role = user?.role;
  const [records, setRecords] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inventory, setInventory] = useState([]);
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
        ? `/api/admin/sales/search?q=${encodeURIComponent(search.trim())}`
        : '/api/admin/sales';
      const [sRes, mRes, supRes, invRes] = await Promise.all([
        api.get(url),
        api.get('/api/admin/medicines'),
        api.get('/api/admin/suppliers'),
        api.get('/api/admin/inventory'),
      ]);
      setRecords([...sRes.data].sort((a, b) => new Date(b.date) - new Date(a.date)));
      setMedicines(mRes.data);
      setSuppliers(supRes.data);
      setInventory(invRes.data);
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e, 'Failed to load transactions.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => { setLoading(true); load(); }, [load]);

  const openAdd = () => { setEditingId(null); setForm({ ...emptyForm, date: new Date() }); setErrorMsg(''); setModalOpen(true); };

  const openEdit = (r) => {
    setEditingId(r.id);
    setForm({
      type: r.type,
      medicineId: String(r.medicine?.id || ''),
      batch: r.batch || '',
      quantity: String(r.quantity ?? ''),
      amount: String(r.amount ?? ''),
      date: r.date ? new Date(r.date) : new Date(),
      supplierId: r.supplier?.id ? String(r.supplier.id) : '',
      manufacturing_date: r.manufacturing_date ? new Date(r.manufacturing_date) : null,
      expiration_date: r.expiration_date ? new Date(r.expiration_date) : null,
      newMedicineName: '',
      newMedicineCategory: '',
      newMedicineDescription: '',
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        quantity: Number(form.quantity) || 1,
        amount: parseFloat(form.amount) || 0,
        date: form.date ? toApiDate(form.date) : null,
        type: form.type,
        batch: form.batch,
      };

      if (form.medicineId === 'new') {
        payload.medicineId = null;
        payload.newMedicineName = form.newMedicineName;
        payload.newMedicineDescription = form.newMedicineDescription || '';
        payload.newMedicineCategory = form.newMedicineCategory || null;
      } else {
        payload.medicineId = Number(form.medicineId) || null;
      }

      if (form.type === 'PURCHASE') {
        payload.supplierId = form.supplierId ? Number(form.supplierId) : null;
        payload.manufacturing_date = form.manufacturing_date ? toApiDate(form.manufacturing_date) : null;
        payload.expiration_date = form.expiration_date ? toApiDate(form.expiration_date) : null;
      }

      const url = editingId ? `/api/admin/sales/${editingId}` : '/api/admin/sales';
      await api[editingId ? 'put' : 'post'](url, payload);
      setModalOpen(false);
      load();
    } catch (e) {
      setErrorMsg(getErrorMessage(e, 'Failed to save transaction.'));
    } finally {
      setSaving(false);
    }
  };

  const remove = (r) => {
    Alert.alert('Delete transaction?', 'Stock will be reverted.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/admin/sales/${r.id}`);
            load();
          } catch (e) {
            Alert.alert('Error', getErrorMessage(e, 'Failed to delete.'));
          }
        },
      },
    ]);
  };

  const availableBatches = useMemo(() => {
    const id = Number(form.medicineId);
    return form.medicineId && form.medicineId !== 'new'
      ? inventory.filter((i) => i.medicine?.id === id && i.available_qty > 0)
      : [];
  }, [form.medicineId, inventory]);

  const medicineOptions = useMemo(() => {
    const opts = medicines.map((m) => ({
      value: String(m.id),
      label: m.category ? `${m.name} (${m.category})` : m.name,
    }));
    if (form.type === 'PURCHASE') {
      opts.unshift({ value: 'new', label: '＋ Add New Medicine' });
    }
    return opts;
  }, [medicines, form.type]);

  const renderItem = ({ item: r }) => {
    const isSale = r.type === 'SALE';
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{r.medicine?.name || 'Unknown'}</Text>
          <Badge text={r.type} color={isSale ? COLORS.success : COLORS.info} bg={isSale ? COLORS.successBg : COLORS.infoBg} border={isSale ? COLORS.successBg : COLORS.infoBg} />
        </View>
        <View style={styles.movRow}><Text style={styles.movLabel}>Batch</Text><Text style={styles.movValue}>{r.batch || '—'}</Text></View>
        <View style={styles.movRow}><Text style={styles.movLabel}>Qty</Text><Text style={styles.movValue}>{r.quantity} units</Text></View>
        <View style={styles.movRow}><Text style={styles.movLabel}>Amount</Text><Text style={styles.movValue}>₹{(r.amount ?? 0).toFixed(2)}</Text></View>
        <View style={styles.movRow}><Text style={styles.movLabel}>Date</Text><Text style={styles.movValue}>{formatDate(r.date)}</Text></View>
        {r.supplier?.name ? (
          <View style={styles.movRow}><Text style={styles.movLabel}>Vendor</Text><Text style={styles.movValue}>{r.supplier.name}</Text></View>
        ) : null}
        {canManage(role) && (
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(r)}><Text style={styles.actionText}>Edit</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => remove(r)}><Text style={[styles.actionText, styles.deleteText]}>Delete</Text></TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const typeColor = form.type === 'PURCHASE' ? COLORS.info : COLORS.success;

  return (
    <View style={styles.flex}>
      <View style={styles.searchWrap}>
        <TextInput style={styles.search} value={search} onChangeText={setSearch} placeholder="Search by medicine, batch or type..." placeholderTextColor={COLORS.faint} />
      </View>

      {loading ? <Loading /> : records.length === 0 ? (
        <EmptyState title={search ? 'No matching transactions' : 'No transactions yet'} subtitle={canManage(role) ? 'Tap + to register a purchase or sale.' : 'No transactions available.'} />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(r) => String(r.id)}
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
            <Text style={styles.modalTitle}>{editingId ? 'Edit Transaction' : 'New Transaction'}</Text>
            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
            <ScrollView keyboardShouldPersistTaps="handled">
              <Select
                label="Transaction Type"
                value={form.type}
                options={[
                  { value: 'PURCHASE', label: 'PURCHASE (Receive Stock)' },
                  { value: 'SALE', label: 'SALE (Dispense Stock)' },
                ]}
                onChange={(v) => setForm({ ...emptyForm, type: v, date: form.date })}
              />
              <Select
                label="Medicine"
                value={form.medicineId}
                options={medicineOptions}
                onChange={(v) => setForm({ ...form, medicineId: v, batch: '' })}
              />

              {form.medicineId === 'new' && form.type === 'PURCHASE' && (
                <View style={styles.inlineNew}>
                  <Text style={styles.inlineTitle}>Define New Medicine</Text>
                  <TextField label="Medicine Name" value={form.newMedicineName} onChangeText={(t) => setForm({ ...form, newMedicineName: t })} placeholder="e.g. Ibuprofen 400mg" />
                  <Select label="Category" value={form.newMedicineCategory} options={CATEGORIES} onChange={(c) => setForm({ ...form, newMedicineCategory: c })} />
                  <TextField label="Description / Usage" value={form.newMedicineDescription} onChangeText={(t) => setForm({ ...form, newMedicineDescription: t })} placeholder="Clinical details..." multiline />
                </View>
              )}

              {form.type === 'SALE' ? (
                <Select
                  label="Select Batch (In Stock)"
                  value={form.batch}
                  options={availableBatches.map((b) => ({ value: b.batch, label: `${b.batch} — Qty: ${b.available_qty}` }))}
                  onChange={(v) => setForm({ ...form, batch: v })}
                />
              ) : (
                <TextField label="Batch Code" value={form.batch} onChangeText={(t) => setForm({ ...form, batch: t })} placeholder="e.g. BATCH-2026A" />
              )}

              <View style={styles.row2}>
                <View style={{ flex: 1 }}>
                  <TextField label="Quantity" value={form.quantity} onChangeText={(t) => setForm({ ...form, quantity: t })} placeholder="Units" keyboardType="number-pad" />
                </View>
                <View style={{ flex: 1 }}>
                  <TextField label="Amount (₹)" value={form.amount} onChangeText={(t) => setForm({ ...form, amount: t })} placeholder="Total cost" keyboardType="decimal-pad" />
                </View>
              </View>

              <DateField label="Transaction Date" value={form.date} onChange={(d) => setForm({ ...form, date: d })} />

              {form.type === 'PURCHASE' && (
                <>
                  <Select
                    label="Supplier (Vendor)"
                    value={form.supplierId}
                    options={suppliers.map((s) => ({ value: String(s.id), label: s.name }))}
                    onChange={(v) => setForm({ ...form, supplierId: v })}
                  />
                  <DateField label="Manufacturing Date" value={form.manufacturing_date} onChange={(d) => setForm({ ...form, manufacturing_date: d })} />
                  <DateField label="Expiration Date" value={form.expiration_date} onChange={(d) => setForm({ ...form, expiration_date: d })} />
                </>
              )}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <AppButton
                style={{ flex: 1.6, backgroundColor: typeColor }}
                title={saving ? 'Saving...' : editingId ? 'Update' : form.type === 'PURCHASE' ? 'Register Purchase' : 'Register Sale'}
                onPress={save}
                disabled={saving || !form.medicineId || !form.quantity}
              />
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
  search: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.card, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: COLORS.text },
  list: { paddingHorizontal: 16, paddingBottom: 96 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, flex: 1, marginRight: 8 },
  movRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  movLabel: { fontSize: 13, color: COLORS.muted },
  movValue: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginLeft: 8 },
  deleteBtn: { backgroundColor: COLORS.dangerBg },
  actionText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  deleteText: { color: COLORS.danger },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '700', lineHeight: 32 },
  inlineNew: { borderWidth: 1, borderStyle: 'dashed', borderColor: COLORS.info, backgroundColor: COLORS.infoBg + '55', borderRadius: 12, padding: 12, marginBottom: 12 },
  inlineTitle: { fontSize: 13, fontWeight: '800', color: COLORS.info, marginBottom: 8 },
  row2: { flexDirection: 'row', gap: 10 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end' },
  modalScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.5)' },
  modalSheet: { backgroundColor: COLORS.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32, maxHeight: '92%' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  error: { backgroundColor: COLORS.dangerBg, color: COLORS.danger, borderRadius: 10, padding: 10, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: COLORS.muted, fontWeight: '700' },
};
