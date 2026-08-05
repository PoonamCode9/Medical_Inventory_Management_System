import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api, getErrorMessage } from '../api/client';
import { ROLE_LABEL } from '../constants';
import { COLORS } from '../theme';
import { API_BASE } from '../config';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const url = isAdmin ? '/api/admin/dashboard/stats' : '/api/pharmacy/dashboard/stats';

  const load = useCallback(async () => {
    setError('');
    try {
      const { data } = await api.get(url);
      setStats(data);
    } catch (e) {
      setError(getErrorMessage(e, 'Failed to load dashboard.'));
    }
  }, [url]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  if (!stats) return <Loading />;

  const cards = [
    { title: 'Medicines', value: stats.totalMedicines ?? 0, accent: COLORS.success },
    { title: 'Inventory Items', value: stats.totalInventoryItems ?? 0, accent: COLORS.warning },
    { title: 'Suppliers', value: stats.totalSuppliers ?? 0, accent: COLORS.violet },
    { title: 'Total Units', value: stats.totalStock ?? 0, accent: COLORS.primary },
    ...(isAdmin ? [{ title: 'Users', value: stats.totalUsers ?? 0, accent: COLORS.info }] : []),
  ];

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.greeting}>
        <Text style={styles.hi}>Welcome back,</Text>
        <Text style={styles.name}>{user?.username}</Text>
        <Text style={styles.role}>{ROLE_LABEL(user?.role)} · {API_BASE}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.cardsRow}>
        {cards.map((c) => (
          <StatCard key={c.title} title={c.title} value={c.value} accent={c.accent} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Stock by Medicine</Text>
        {stats.stockByMedicine?.length ? (
          stats.stockByMedicine.slice(0, 8).map((item, i) => (
            <View key={item.name} style={styles.row}>
              <Text style={styles.rowName} numberOfLines={1}>{i + 1}. {item.name}</Text>
              <Text style={styles.rowValue}>{item.value} units</Text>
            </View>
          ))
        ) : (
          <EmptyState title="No stock data" subtitle="Stock appears after purchases are registered." />
        )}
      </View>
    </ScrollView>
  );
}

const styles = {
  flex: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 32 },
  greeting: { marginBottom: 18 },
  hi: { fontSize: 15, color: COLORS.muted },
  name: { fontSize: 26, fontWeight: '900', color: COLORS.text },
  role: { fontSize: 13, color: COLORS.faint, marginTop: 4 },
  error: {
    backgroundColor: COLORS.dangerBg,
    color: COLORS.danger,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  cardsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginTop: 6,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowName: { fontSize: 14, fontWeight: '600', color: COLORS.text, flex: 1, marginRight: 8 },
  rowValue: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
};
