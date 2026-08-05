import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
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
import Badge from '../components/Badge';

const STATUS_META = {
  expired: { label: 'Expired', color: COLORS.danger, bg: COLORS.dangerBg },
  critical: { label: 'Critical', color: '#dc2626', bg: '#fee2e2' },
  warning: { label: 'Warning', color: COLORS.warning, bg: COLORS.warningBg },
  safe: { label: 'Safe', color: COLORS.success, bg: COLORS.successBg },
};

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const exp = new Date(dateStr + 'T00:00:00');
  return Math.round((exp - today) / 86400000);
};

const itemStatus = (item) => {
  const d = daysUntil(item.expiration_date);
  if (d === null) return 'safe';
  if (d < 0) return 'expired';
  if (d < 10) return 'critical';
  if (d <= 30) return 'warning';
  return 'safe';
};

export default function ExpiryScreen() {
  const { user } = useAuth();
  const role = user?.role;
  const [summary, setSummary] = useState({ expired: 0, critical: 0, warning: 0, safe: 0, atRiskUnits: 0 });
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);

  const base = role === 'PHARMACIST' ? '/api/pharmacy' : '/api/admin';

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`${base}/expiry?days=30`);
      setSummary(data);
      setItems(data.items || []);
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e, 'Failed to load expiry data.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [base]);

  useEffect(() => { load(); }, [load]);

  const enriched = useMemo(
    () => items.map((i) => ({ ...i, status: itemStatus(i), daysLeft: daysUntil(i.expiration_date) })),
    [items]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enriched.filter((i) => {
      if (filter !== 'all' && i.status !== filter) return false;
      if (q) {
        const hay = `${i.medicine?.name || ''} ${i.batch || ''} ${i.supplier || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enriched, filter, search]);

  const cards = [
    { title: 'Expired', value: summary.expired, color: COLORS.danger },
    { title: 'Critical <10d', value: summary.critical, color: '#dc2626' },
    { title: 'Warning <30d', value: summary.warning, color: COLORS.warning },
    { title: 'At-Risk Units', value: summary.atRiskUnits, color: COLORS.text },
  ];

  const tabs = [
    { key: 'all', label: `All (${items.length})` },
    { key: 'expired', label: `Expired (${summary.expired})` },
    { key: 'critical', label: `Critical (${summary.critical})` },
    { key: 'warning', label: `Warning (${summary.warning})` },
    { key: 'safe', label: `Safe (${summary.safe})` },
  ];

  const sendReport = async () => {
    Alert.alert('Send expiry report?', 'Email report will be sent to all ADMIN, PHARMACIST and STAFF users.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send Report',
        onPress: async () => {
          setSending(true);
          try {
            const { data } = await api.post('/api/admin/expiry/send-report');
            Alert.alert('Report sent!', `Emailed ${data.recipients ?? 0} recipient(s) · Critical ${data.criticalCount ?? 0} · Warning ${data.warningCount ?? 0}`);
          } catch (e) {
            Alert.alert('Failed to send', getErrorMessage(e, 'Check SMTP settings.'));
          } finally {
            setSending(false);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item: i }) => {
    const meta = STATUS_META[i.status];
    return (
      <View style={styles.row}>
        <View style={styles.rowInfo}>
          <Text style={styles.rowTitle}>{i.medicine?.name || i.medicine_name || 'Unknown'}</Text>
          <Text style={styles.rowMeta}>
            {i.batch || '—'} · Exp {formatDate(i.expiration_date)}
          </Text>
          {i.supplier ? <Text style={styles.rowMeta}>Supplier: {i.supplier}</Text> : null}
        </View>
        <View style={styles.rowRight}>
          <Text style={styles.qty}>{i.available_qty}</Text>
          <Text style={styles.days}>{i.daysLeft === null ? '—' : i.daysLeft < 0 ? 'EXPIRED' : `${i.daysLeft} days`}</Text>
          <Badge text={meta.label} color={meta.color} bg={meta.bg} border={meta.bg} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        {role === 'ADMIN' && (
          <TouchableOpacity style={styles.reportBtn} onPress={sendReport} disabled={sending}>
            <Text style={styles.reportBtnText}>{sending ? 'Sending...' : '📧 Send Expiry Report'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardsRow}>
        {cards.map((c) => (
          <View key={c.title} style={[styles.card, { borderLeftColor: c.color }]}>
            <Text style={styles.cardTitle}>{c.title}</Text>
            <Text style={styles.cardValue}>{c.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tabsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((t) => (
            <TouchableOpacity key={t.key} style={[styles.tab, filter === t.key && styles.tabActive]} onPress={() => setFilter(t.key)}>
              <Text style={[styles.tabText, filter === t.key && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.searchWrap}>
        <TextInput style={styles.search} value={search} onChangeText={setSearch} placeholder="Search medicine, batch, supplier..." placeholderTextColor={COLORS.faint} />
      </View>

      {loading ? <Loading color={COLORS.danger} /> : filtered.length === 0 ? (
        <EmptyState title={search || filter !== 'all' ? 'No matching items' : 'No inventory with expiry dates'} subtitle="Add stock via purchase transactions to track expiry." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        />
      )}
    </View>
  );
}

const styles = {
  flex: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 16, paddingBottom: 0, alignItems: 'flex-end' },
  reportBtn: { backgroundColor: COLORS.header, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  reportBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  cardsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 16, paddingBottom: 6 },
  card: { width: '48%', backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 4, padding: 12, marginBottom: 10 },
  cardTitle: { fontSize: 11, fontWeight: '600', color: COLORS.muted, textTransform: 'uppercase' },
  cardValue: { fontSize: 22, fontWeight: '900', color: COLORS.text, marginTop: 4 },
  tabsRow: { paddingHorizontal: 16 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card, marginRight: 8 },
  tabActive: { backgroundColor: COLORS.header, borderColor: COLORS.header },
  tabText: { fontSize: 13, fontWeight: '700', color: COLORS.muted },
  tabTextActive: { color: '#fff' },
  searchWrap: { paddingHorizontal: 16, paddingVertical: 12 },
  search: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.card, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: COLORS.text },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  row: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowInfo: { flex: 1, marginRight: 10 },
  rowTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  rowMeta: { fontSize: 12, color: COLORS.muted, marginTop: 3 },
  rowRight: { alignItems: 'flex-end' },
  qty: { fontSize: 16, fontWeight: '900', color: COLORS.text },
  days: { fontSize: 11, color: COLORS.faint, marginTop: 2, marginBottom: 4 },
};
