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
import { ROLES, ROLE_LABEL, roleColor } from '../constants';
import { COLORS } from '../theme';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import TextField from '../components/TextField';
import AppButton from '../components/AppButton';
import Select from '../components/Select';
import Badge from '../components/Badge';

const emptyForm = { name: '', username: '', password: '', role: 'STAFF', email: '' };

export default function UsersScreen() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
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
        ? `/api/admin/users/search?q=${encodeURIComponent(search.trim())}`
        : '/api/admin/users';
      const { data } = await api.get(url);
      setUsers(data);
    } catch (e) {
      Alert.alert('Error', getErrorMessage(e, 'Failed to load users.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditingId(null); setForm({ ...emptyForm }); setErrorMsg(''); setModalOpen(true); };

  const openEdit = (u) => {
    setEditingId(u.id);
    setForm({ name: u.name || '', username: u.username || '', password: '', role: u.role || 'STAFF', email: u.email || '' });
    setErrorMsg('');
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = { name: form.name, username: form.username, password: form.password, role: form.role, email: form.email };
      const url = editingId ? `/api/admin/users/${editingId}` : '/api/admin/users';
      await api[editingId ? 'put' : 'post'](url, payload);
      setModalOpen(false);
      load();
    } catch (e) {
      setErrorMsg(getErrorMessage(e, 'Failed to save user.'));
    } finally {
      setSaving(false);
    }
  };

  const remove = (u) => {
    Alert.alert('Delete user?', `${u.username} will be removed permanently.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/admin/users/${u.id}`);
            load();
          } catch (e) {
            Alert.alert('Error', getErrorMessage(e, 'Failed to delete.'));
          }
        },
      },
    ]);
  };

  const isSelf = (u) => u.username === user?.username;

  const renderItem = ({ item: u }) => {
    const color = roleColor(u.role);
    const initials = (u.name || u.username || '?').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
    const self = isSelf(u);
    return (
      <View style={[styles.card, { borderTopColor: color }]}>
        <View style={styles.cardTop}>
          <View style={[styles.avatar, { backgroundColor: color }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.ident}>
            <Text style={styles.name} numberOfLines={1}>{u.name}</Text>
            <Text style={styles.username}>@{u.username}</Text>
          </View>
          <Badge text={ROLE_LABEL(u.role)} color={color} bg={color + '1A'} border={color + '40'} />
        </View>

        <View style={styles.emailRow}>
          <Text style={styles.emailIcon}>✉</Text>
          <Text style={styles.email} numberOfLines={1}>{u.email}</Text>
        </View>

        <View style={styles.actions}>
          {self ? (
            <View style={styles.youChip}><Text style={styles.youText}>This is you</Text></View>
          ) : (
            <>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(u)}>
                <Text style={[styles.btnText, { color }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(u)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  const ready = form.name.trim() && form.username.trim() && form.email.trim() && (!!editingId || form.password.trim());

  return (
    <View style={styles.flex}>
      <View style={styles.searchWrap}>
        <TextInput style={styles.search} value={search} onChangeText={setSearch} placeholder="Search users..." placeholderTextColor={COLORS.faint} />
      </View>

      {loading ? <Loading color="#6366f1" /> : users.length === 0 ? (
        <EmptyState title={search ? 'No matching users' : 'No users yet'} subtitle="Tap + to create a team account." />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(u) => String(u.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={openAdd} activeOpacity={0.85}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <Modal visible={modalOpen} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.modalScrim} onPress={() => setModalOpen(false)} />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit User' : 'New User'}</Text>
            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
            <ScrollView keyboardShouldPersistTaps="handled">
              <TextField label="Full Name *" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="e.g. Jane Cooper" />
              <TextField label="Username *" value={form.username} onChangeText={(t) => setForm({ ...form, username: t })} placeholder="e.g. jane" autoCapitalize="none" />
              <TextField label="Email *" value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} placeholder="jane@clinic.com" keyboardType="email-address" autoCapitalize="none" />
              <TextField label={editingId ? 'New Password (blank = keep current)' : 'Password *'} value={form.password} onChangeText={(t) => setForm({ ...form, password: t })} placeholder="Min 6 characters" secureTextEntry />
              <Select label="Role" value={form.role} options={ROLES.map((r) => ({ value: r, label: ROLE_LABEL(r) }))} onChange={(r) => setForm({ ...form, role: r })} />
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <AppButton style={{ flex: 1.6 }} title={saving ? 'Saving...' : editingId ? 'Update' : 'Create User'} onPress={save} disabled={saving || !ready} />
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
  card: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, borderTopWidth: 3, padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  ident: { flex: 1, marginRight: 6 },
  name: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  username: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  emailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  emailIcon: { fontSize: 12, color: COLORS.faint, marginRight: 6 },
  email: { fontSize: 13, color: COLORS.muted, flex: 1 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  youChip: { flex: 1, borderRadius: 10, paddingVertical: 9, alignItems: 'center', backgroundColor: COLORS.border },
  youText: { fontSize: 13, fontWeight: '700', color: COLORS.muted },
  editBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  deleteBtn: { flex: 1, backgroundColor: COLORS.dangerBg, borderWidth: 1, borderColor: COLORS.dangerBg, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  btnText: { fontSize: 13, fontWeight: '700' },
  deleteText: { fontSize: 13, fontWeight: '700', color: COLORS.danger },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
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
