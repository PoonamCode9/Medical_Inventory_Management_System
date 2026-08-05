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
import { formatDate, toApiDate } from '../constants';
import { COLORS } from '../theme';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import TextField from '../components/TextField';
import AppButton from '../components/AppButton';
import Select from '../components/Select';
import DateField from '../components/DateField';
import Badge from '../components/Badge';

const BASE = (role) => (role === 'PHARMACIST' ? '/api/pharmacy' : '/api/admin');
const canManage = (role) => role === 'ADMIN' || role === 'PHARMACIST';

const emptyForm = {
  medicineId: '',
  batch: '',
  available_qty: '',
  supplier: '',
  manufacturing_date: null,
  expiration_date: null,
};

export default function InventoryScreen() {
  const { user } = useAuth();
  const role = user?.role;
  const [items, setItems] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [movements, setMovements] = useState([]);
  const [tab, setTab] = useState('stock');
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
      const invUrl = q ? `${base}/inventory/search?q=${encodeURIComponent(q)}` : `${base}/inventory`;
      const movUrl = q ? `/api/admin/sales/search?q=${encodeURIComponent(q)}` : '/api/admin/sales';
      const [invRes, movRes, medRes] = await Promise.all([
        api.get(invUrl),
        api.get(movUrl),
        api.get(`${base}/medicines`),
      ]);
      setItems(invRes.data);
      setMovements(
        [...movRes.data].sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      setMedicines(medRes.data);
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e, 'Failed to load inventory.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [base, search]);

  useEffect(() => { setLoading(true); load(); }, [load]);

  const stockByMedicine = useMemo(() => {
    const map = {};
    items.forEach((i) => {
      const name = i.medicine?.name || 'Unknown';
      if (!map[name]) map[name] = { name, totalQty: 0, batches: [] };
      map[name].totalQty += i.available_qty || 0;
      map[name].batches.push(i);
    });
    return Object.values(map).sort((a, b) => b.totalQty - a.totalQty);
  }, [items]);

  const totalStock = useMemo(() => items.reduce((s, i) => s + (i.available_qty || 0), 0), [items]);
  const lowStock = useMemo(() => items.filter((i) => i.available_qty < 15).length, [items]);

  const summary = [
    { title: 'Medicines', value: stockByMedicine.length, accent: COLORS.info },
    { title: 'Units', value: totalStock, accent: COLORS.success },
    { title: 'Batches', value: items.length, accent: COLORS.warning },
    { title: 'Low Stock', value: lowStock, accent: COLORS.danger },
  ];

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setErrorMsg(''); setModalOpen(true); };
  const openEdit = (inv) => {
    setEditingId(inv.id);
    setForm({
      medicineId: String(inv.medicine?.id || ''),
      batch: inv.batch || '',
      available_qty: String(inv.available_qty ?? ''),
      supplier: inv.supplier || '',
      manufacturing_date: inv.manufacturing_date ? new Date(inv.manufacturing_date) : null,
      expiration_date: inv.expiration_date ? new Date(inv.expiration_date) : null,
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        medicineId: Number(form.medicineId),
        batch: form.batch,
        available_qty: Number(form.available_qty),
        supplier: form.supplier,
        manufacturing_date: form.manufacturing_date ? toApiDate(form.manufacturing_date) : null,
        expiration_date: form.expiration_date ? toApiDate(form.expiration_date) : null,
      };
      const url = editingId ? `/api/admin/inventory/${editingId}` : '/api/admin/inventory';
      await api[editingId ? 'put' : 'post'](url, payload);
      setModalOpen(false);
      load();
    } catch (e) {
      setErrorMsg(getErrorMessage(e, 'Failed to save inventory.'));
    } finally {
      setSaving(false);
    }
  };

  const remove = (inv) => {
    Alert.alert('Delete batch?', `Remove batch "${inv.batch}" for ${inv.medicine?.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/admin/inventory/${inv.id}`);
            load();
          } catch (e) {
            Alert.alert('Error', getErrorMessage(e, 'Failed to delete.'));
          }
        },
      },
    ]);
  };

  const stockCard = ({ item }) => {
    const q = item.totalQty;
    const qColor = q === 0 ? COLORS.danger : q < 15 ? COLORS.warning : COLORS.success;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Badge text={`${q} units`} color={qColor} bg={qColor + '1a'} border={qColor + '33'} />
        </View>
        <Text style={styles.cardMeta}>{item.batches.length} batch{item.batches.length !== 1 ? 'es' : ''}</Text>
        {item.batches.map((b) => {
          const exp = b.expiration_date && new Date(b.expiration_date);
          const expired = exp && exp < new Date();
          return (
            <View key={b.id} style={styles.batchRow}>
              <View style={styles.batchInfo}>
                <Text style={styles.batchCode}>{b.batch || '—'}</Text>
                <Text style={styles.batchDates}>
                  Mfg {formatDate(b.manufacturing_date)} · Exp {formatDate(b.expiration_date)}
                </Text>
              </View>
              <View style={styles.batchRight}>
                <Text style={styles.batchQty}>{b.available_qty} in stock</Text>
                {expired && <Text style={styles.expiredTag}>EXPIRED</Text>}
                {canManage(role) && (
                  <View style={styles.batchActions}>
                    <TouchableOpacity onPress={() => openEdit(b)}><Text style={styles.editTxt}>Edit</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => remove(b)}><Text style={styles.delTxt}>Del</Text></TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const movementRow = ({ item: m }) => {
    const isSale = m.type === 'SALE';
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{m.medicine?.name || 'Unknown'}</Text>
          <Badge
            text={m.type}
            color={isSale ? COLORS.success : COLORS.info}
            bg={isSale ? COLORS.successBg : COLORS.infoBg}
            border={isSale ? COLORS.successBg : COLORS.infoBg}
          />
        </View>
        <View style={styles.movRow}>
          <Text style={styles.movLabel}>Batch</Text>
          <Text style={styles.movValue}>{m.batch || '—'}</Text>
        </View>
        <View style={styles.movRow}>
          <Text style={styles.movLabel}>Qty</Text>
          <Text style={styles.movValue}>{m.quantity} units</Text>
        </View>
        <View style={styles.movRow}>
          <Text style={styles.movLabel}>Amount</Text>
          <Text style={styles.movValue}>₹{(m.amount ?? 0).toFixed(2)}</Text>
        </View>
        <View style={styles.movRow}>
          <Text style={styles.movLabel}>Date</Text>
          <Text style={styles.movValue}>{formatDate(m.date)}</Text>
        </View>
        {m.supplier?.name ? (
          <View style={styles.movRow}>
            <Text style={styles.movLabel}>Vendor</Text>
            <Text style={styles.movValue}>{m.supplier.name}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  const data = tab === 'stock' ? stockByMedicine : movements;

  return (
    <View style={styles.flex}>
      <View style={styles.tabs}>
        {['stock', 'movements'].map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'stock' ? '📦 Stock' : '🔄 Movements'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchWrap}>
        <TextInput style={styles.search} value={search} onChangeText={setSearch} placeholder="Search..." placeholderTextColor={COLORS.faint} />
      </View>

      {loading ? <Loading /> : data.length === 0 ? (
        <EmptyState title={search ? 'No matches' : tab === 'stock' ? 'No stock yet' : 'No transactions yet'} subtitle={tab === 'stock' && canManage(role) ? 'Tap + to add a stock batch.' : 'Try a different search.'} />
      ) : tab === 'stock' ? (
        <>
          <View style={styles.summaryRow}>
            {summary.map((s) => (
              <View key={s.title} style={[styles.summaryCard, { borderLeftColor: s.accent }]}>
                <Text style={styles.summaryTitle}>{s.title}</Text>
                <Text style={styles.summaryValue}>{s.value}</Text>
              </View>
            ))}
          </View>
          <FlatList
            data={stockByMedicine}
            keyExtractor={(s) => s.name}
            renderItem={stockCard}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
          />
        </>
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(m) => String(m.id)}
          renderItem={movementRow}
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
            <Text style={styles.modalTitle}>{editingId ? 'Edit Stock Batch' : 'Add Stock Batch'}</Text>
            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
            <ScrollView keyboardShouldPersistTaps="handled">
              <Select
                label="Medicine"
                value={form.medicineId}
                options={medicines.map((m) => ({ value: String(m.id), label: m.name }))}
                onChange={(v) => setForm({ ...form, medicineId: v })}
              />
              <TextField label="Batch Code" value={form.batch} onChangeText={(t) => setForm({ ...form, batch: t })} placeholder="e.g. BATCH-2026A" />
              <TextField label="Available Qty" value={form.available_qty} onChangeText={(t) => setForm({ ...form, available_qty: t })} placeholder="Units in stock" keyboardType="number-pad" />
              <TextField label="Supplier Name" value={form.supplier} onChangeText={(t) => setForm({ ...form, supplier: t })} placeholder="Vendor name" />
              <DateField label="Manufacturing Date" value={form.manufacturing_date} onChange={(d) => setForm({ ...form, manufacturing_date: d })} />
              <DateField label="Expiration Date" value={form.expiration_date} onChange={(d) => setForm({ ...form, expiration_date: d })} />
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <AppButton style={{ flex: 1.6 }} title={saving ? 'Saving...' : 'Save Batch'} onPress={save} disabled={saving || !form.medicineId || !form.available_qty} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = {
  flex: { flex: 1, backgroundColor: COLORS.bg },
  tabs: { flexDirection: 'row', padding: 16, paddingBottom: 4 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    marginRight: 8,
  },
  tabActive: { backgroundColor: COLORS.header, borderColor: COLORS.header },
  tabText: { fontSize: 14, fontWeight: '700', color: COLORS.muted },
  tabTextActive: { color: '#fff' },
  searchWrap: { paddingHorizontal: 16, paddingVertical: 8 },
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
  summaryRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6 },
  summaryCard: { width: '48%', backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 4, padding: 12, marginBottom: 10 },
  summaryTitle: { fontSize: 11, fontWeight: '600', color: COLORS.muted, textTransform: 'uppercase' },
  summaryValue: { fontSize: 22, fontWeight: '900', color: COLORS.text, marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 96 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, flex: 1, marginRight: 8 },
  cardMeta: { fontSize: 12, color: COLORS.faint, marginTop: 4 },
  batchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  batchInfo: { flex: 1, marginRight: 8 },
  batchCode: { fontSize: 13, fontWeight: '700', color: COLORS.text, fontFamily: Platform.select({ android: 'monospace' }) },
  batchDates: { fontSize: 10, color: COLORS.faint, marginTop: 2 },
  batchRight: { alignItems: 'flex-end' },
  batchQty: { fontSize: 12, fontWeight: '800', color: COLORS.text },
  expiredTag: { fontSize: 9, fontWeight: '800', color: COLORS.danger, marginTop: 3 },
  batchActions: { flexDirection: 'row', gap: 12, marginTop: 6 },
  editTxt: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  delTxt: { fontSize: 12, fontWeight: '700', color: COLORS.danger },
  movRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  movLabel: { fontSize: 13, color: COLORS.muted },
  movValue: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '700', lineHeight: 32 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end' },
  modalScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.5)' },
  modalSheet: { backgroundColor: COLORS.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32, maxHeight: '88%' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  error: { backgroundColor: COLORS.dangerBg, color: COLORS.danger, borderRadius: 10, padding: 10, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: COLORS.muted, fontWeight: '700' },
};
