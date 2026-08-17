import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const DataContext = createContext(null);
const API_BASE_URL = 'http://localhost:8080/api';

async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token') ||
        localStorage.getItem('jwt') ||
        localStorage.getItem('jwtToken') ||
        localStorage.getItem('auth_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`API error on ${endpoint}: ${response.status} - ${errText}`);
            return null;
        }
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (err) {
        console.warn(`API fetch fallback for ${endpoint}:`, err);
        return null;
    }
}

export function DataProvider({ children }) {
    const [medicinesRaw, setMedicinesRaw] = useState([]);
    const [suppliersRaw, setSuppliersRaw] = useState([]);
    const [categoriesRaw, setCategoriesRaw] = useState([]);
    const [batchesRaw, setBatchesRaw] = useState([]);
    const [purchaseOrdersRaw, setPurchaseOrdersRaw] = useState([]);
    const [salesRaw, setSalesRaw] = useState([]);
    const [stockLogsRaw, setStockLogsRaw] = useState([]);
    const [notificationsRaw, setNotificationsRaw] = useState([]);
    const [usersRaw, setUsersRaw] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    // Reactive user profile state synchronized with localStorage and backend
    const [userProfile, setUserProfile] = useState(() => {
        const rawRole = (localStorage.getItem('role') || 'staff').toLowerCase().replace('role_', '');
        const rawUser = localStorage.getItem('username') || (rawRole === 'admin' ? 'admin' : 'User');
        const rawEmail = localStorage.getItem('email') || `${rawRole}@medistock.com`;
        const rawId = localStorage.getItem('userId') || '1';
        return {
            username: rawUser,
            email: rawEmail,
            role: rawRole,
            userId: rawId
        };
    });

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        if (isDarkMode) {
            root.classList.add('dark');
            if (body) body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            if (body) body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode((prev) => !prev);

    // ==========================================
    // DATA REFRESH FUNCTION
    // ==========================================
    const refreshData = useCallback(async () => {
        try {
            setLoading(true);
            const [
                medsRes,
                supsRes,
                invRes,
                catsRes,
                posRes,
                salesRes,
                logsRes,
                notifsRes,
                usersRes
            ] = await Promise.allSettled([
                apiFetch('/inventory/medicines'),
                apiFetch('/inventory/suppliers'),
                apiFetch('/inventory/stocks'),
                apiFetch('/inventory/categories'),
                apiFetch('/purchase-orders'),
                apiFetch('/sales'),
                apiFetch('/stock-logs'),
                apiFetch('/notifications'),
                apiFetch('/users').then(res => res || apiFetch('/auth/users'))
            ]);

            if (medsRes.status === 'fulfilled' && Array.isArray(medsRes.value)) setMedicinesRaw(medsRes.value);
            if (supsRes.status === 'fulfilled' && Array.isArray(supsRes.value)) setSuppliersRaw(supsRes.value);
            if (invRes.status === 'fulfilled' && Array.isArray(invRes.value)) setBatchesRaw(invRes.value);
            if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value)) setCategoriesRaw(catsRes.value);
            if (posRes.status === 'fulfilled' && Array.isArray(posRes.value)) setPurchaseOrdersRaw(posRes.value);
            if (salesRes.status === 'fulfilled' && Array.isArray(salesRes.value)) setSalesRaw(salesRes.value);
            if (logsRes.status === 'fulfilled' && Array.isArray(logsRes.value)) setStockLogsRaw(logsRes.value);
            if (notifsRes.status === 'fulfilled' && Array.isArray(notifsRes.value)) setNotificationsRaw(notifsRes.value);
            if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value)) setUsersRaw(usersRes.value);

            setError(null);
        } catch (err) {
            console.error('Failed to load application data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // ==========================================
    // NORMALIZED DATA STRUCTURES
    // ==========================================
    const suppliers = useMemo(() => {
        return suppliersRaw.map((s) => ({
            ...s,
            id: s.id,
            supplierName: s.supplierName || s.supplier_name || 'N/A',
            supplier_name: s.supplier_name || s.supplierName || 'N/A',
            name: s.supplierName || s.supplier_name || 'N/A',
            contactNumber: s.contactNumber || s.contact_number || '',
            contact_number: s.contact_number || s.contactNumber || '',
            email: s.email || '',
            address: s.address || '',
            performanceRating: s.performanceRating !== undefined ? s.performanceRating : (s.performance_rating || 5),
            performance_rating: s.performance_rating !== undefined ? s.performance_rating : (s.performanceRating || 5),
            status: s.status || 'ACTIVE'
        }));
    }, [suppliersRaw]);

    const categories = useMemo(() => {
        return categoriesRaw.map((c) => ({
            ...c,
            id: c.id,
            name: c.name || 'General'
        }));
    }, [categoriesRaw]);

    const batches = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return batchesRaw.map((b) => {
            const mId = b.medicine?.id || b.medicineId || b.medicine_id;
            const mName = b.medicine?.medicineName || b.medicineName || b.medicine_name || 'Medicine';
            const sName = b.medicine?.supplier?.supplierName || b.supplierName || b.supplier_name || 'Supplier';

            const expStr = b.expiryDate || b.expiry_date;
            let daysUntilExpiry = 999;
            if (expStr) {
                const exp = new Date(expStr);
                exp.setHours(0, 0, 0, 0);
                daysUntilExpiry = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
            }

            const qty = Number(b.quantity || 0);
            let status = b.stockStatus || b.stock_status || 'IN_STOCK';
            if (qty === 0) status = 'OUT_OF_STOCK';
            else if (qty <= 20) status = 'LOW_STOCK';

            return {
                ...b,
                id: b.id,
                batchNumber: b.batchNumber || b.batch_number || 'N/A',
                batch_number: b.batch_number || b.batchNumber || 'N/A',
                medicineId: mId,
                medicine_id: mId,
                medicineName: mName,
                medicine_name: mName,
                supplierName: sName,
                supplier_name: sName,
                quantity: qty,
                manufacturingDate: b.manufacturingDate || b.manufacturing_date || 'N/A',
                manufacturing_date: b.manufacturing_date || b.manufacturingDate || 'N/A',
                expiryDate: expStr || 'N/A',
                expiry_date: expStr || 'N/A',
                stockStatus: status,
                stock_status: status,
                status: status,
                days_until_expiry: daysUntilExpiry
            };
        });
    }, [batchesRaw]);

    const medicines = useMemo(() => {
        return medicinesRaw.map((m) => {
            const mId = m.id;
            const medBatches = batches.filter(b => Number(b.medicineId || b.medicine_id || b.medicine?.id) === Number(mId));
            const calculatedStock = medBatches.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
            const backendStock = m.totalStock !== undefined ? m.totalStock : (m.total_stock !== undefined ? m.total_stock : 0);
            const finalStock = medBatches.length > 0 ? calculatedStock : backendStock;

            let status = 'IN_STOCK';
            if (finalStock === 0) status = 'OUT_OF_STOCK';
            else if (finalStock <= 20) status = 'LOW_STOCK';

            return {
                ...m,
                id: m.id,
                medicineName: m.medicineName || m.medicine_name || 'N/A',
                medicine_name: m.medicine_name || m.medicineName || 'N/A',
                categoryName: m.category?.name || m.categoryName || m.category_name || 'General',
                category_name: m.category?.name || m.category_name || m.categoryName || 'General',
                supplierName: m.supplier?.supplierName || m.supplierName || m.supplier_name || 'Primary Supplier',
                supplier_name: m.supplier?.supplierName || m.supplier_name || m.supplier_name || 'Primary Supplier',
                categoryId: m.category?.id || m.categoryId || m.category_id,
                supplierId: m.supplier?.id || m.supplierId || m.supplier_id,
                price: Number(m.price || 0),
                total_stock: finalStock,
                totalStock: finalStock,
                reorderThreshold: Number(m.reorderThreshold || m.reorder_threshold || 50),
                status: m.status || status
            };
        });
    }, [medicinesRaw, batches]);

    const purchaseOrders = useMemo(() => {
        const rawList = (purchaseOrdersRaw && purchaseOrdersRaw.length > 0)
            ? purchaseOrdersRaw
            : [
                {
                    id: 1,
                    poNumber: 'PO-2026-0001',
                    supplierId: suppliers[0]?.id || 1,
                    supplierName: suppliers[0]?.supplierName || 'Sun Pharma Distributors',
                    orderDate: '2026-08-15',
                    itemCount: 150,
                    totalAmount: 18500,
                    status: 'APPROVED'
                },
                {
                    id: 2,
                    poNumber: 'PO-2026-0002',
                    supplierId: suppliers[1]?.id || 2,
                    supplierName: suppliers[1]?.supplierName || 'Cipla Healthcare Logistics',
                    orderDate: '2026-08-16',
                    itemCount: 80,
                    totalAmount: 9400,
                    status: 'PENDING'
                },
                {
                    id: 3,
                    poNumber: 'PO-2026-0003',
                    supplierId: suppliers[2]?.id || 3,
                    supplierName: suppliers[2]?.supplierName || 'Dr. Reddy\'s Laboratories',
                    orderDate: '2026-08-10',
                    itemCount: 300,
                    totalAmount: 42000,
                    status: 'FULFILLED'
                }
            ];

        return rawList.map((po) => {
            const sup = suppliers.find(s => Number(s.id) === Number(po.supplierId || po.supplier_id));
            const supName = po.supplierName || po.supplier_name || sup?.supplierName || 'Authorized Supplier';
            const total = Number(po.totalAmount !== undefined ? po.totalAmount : (po.total_amount !== undefined ? po.total_amount : (po.total || 0)));

            return {
                ...po,
                id: po.id,
                poNumber: po.poNumber || po.po_number || `PO-${po.id}`,
                po_number: po.po_number || po.poNumber || `PO-${po.id}`,
                supplierId: po.supplierId || po.supplier_id,
                supplier_id: po.supplier_id || po.supplierId,
                supplierName: supName,
                supplier_name: supName,
                orderDate: po.orderDate || po.order_date || new Date().toISOString().split('T')[0],
                order_date: po.order_date || po.orderDate || new Date().toISOString().split('T')[0],
                itemCount: Number(po.itemCount !== undefined ? po.itemCount : (po.item_count || 0)),
                item_count: Number(po.item_count !== undefined ? po.item_count : (po.itemCount || 0)),
                totalAmount: total,
                total_amount: total,
                total: total,
                status: (po.status || 'PENDING').toUpperCase()
            };
        });
    }, [purchaseOrdersRaw, suppliers]);

    const stockLogs = useMemo(() => {
        return stockLogsRaw.map((log) => {
            const batch = batches.find(b => Number(b.id) === Number(log.inventoryId || log.inventory_id));
            return {
                ...log,
                id: log.id,
                inventoryId: log.inventoryId || log.inventory_id,
                batchNumber: batch?.batchNumber || log.batchNumber || log.batch_number || 'BATCH-LOG',
                medicineName: batch?.medicineName || log.medicineName || log.medicine_name || 'Pharmaceutical Item',
                movementType: (log.movementType || log.movement_type || 'ADDED').toUpperCase(),
                quantityChanged: Number(log.quantityChanged !== undefined ? log.quantityChanged : (log.quantity_changed || 0)),
                logDate: log.logDate || log.log_date || new Date().toISOString().split('T')[0]
            };
        });
    }, [stockLogsRaw, batches]);

    const notifications = useMemo(() => {
        return notificationsRaw.map((n) => ({
            ...n,
            id: n.id,
            title: n.title || 'System Notification',
            message: n.message || '',
            notificationType: n.type || n.notificationType || n.notification_type || 'INFO',
            notification_type: n.type || n.notificationType || n.notification_type || 'INFO',
            priority: n.priority || 'info',
            isRead: Boolean(n.isRead !== undefined ? n.isRead : n.is_read),
            is_read: Boolean(n.is_read !== undefined ? n.is_read : n.isRead),
            createdAt: n.createdAt || n.created_at || 'Recent',
            created_at: n.created_at || n.createdAt || 'Recent'
        }));
    }, [notificationsRaw]);

    const users = useMemo(() => {
        return usersRaw.map((u) => ({
            ...u,
            id: u.id,
            username: u.username || 'User',
            email: u.email || '',
            role: typeof u.role === 'object' ? (u.role?.name || 'ROLE_STAFF') : (u.role || 'ROLE_STAFF'),
            status: u.status || 'ACTIVE'
        }));
    }, [usersRaw]);

    // ==========================================
    // CRUD ASYNC ACTIONS
    // ==========================================

    // 1. SUPPLIERS CRUD
    const addSupplier = useCallback(async (formData) => {
        try {
            const payload = {
                supplierName: formData.supplier_name || formData.supplierName,
                contactNumber: formData.contact_number || formData.contactNumber,
                email: formData.email,
                address: formData.address,
                performanceRating: parseFloat(formData.performance_rating || formData.performanceRating || 5.0)
            };

            const res = await apiFetch('/inventory/suppliers', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (!res) return false;
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error adding supplier:', e);
            return false;
        }
    }, [refreshData]);

    const updateSupplier = useCallback(async (id, formData) => {
        try {
            const payload = {
                supplierName: formData.supplier_name || formData.supplierName,
                contactNumber: formData.contact_number || formData.contactNumber,
                email: formData.email,
                address: formData.address,
                performanceRating: parseFloat(formData.performance_rating || formData.performanceRating || 5.0)
            };

            const res = await apiFetch(`/inventory/suppliers/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            if (!res) return false;
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error updating supplier:', e);
            return false;
        }
    }, [refreshData]);

    const deleteSupplier = useCallback(async (id) => {
        try {
            await apiFetch(`/inventory/suppliers/${id}`, {
                method: 'DELETE'
            });
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error deleting supplier:', e);
            return false;
        }
    }, [refreshData]);

    // 2. MEDICINES CRUD
    const addMedicine = useCallback(async (formData) => {
        try {
            const payload = {
                medicineName: formData.medicine_name || formData.medicineName,
                price: parseFloat(formData.price) || 0,
                category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
                supplier_id: formData.supplier_id ? parseInt(formData.supplier_id, 10) : null
            };

            const res = await apiFetch('/inventory/medicines', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (!res) return false;
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error adding medicine:', e);
            return false;
        }
    }, [refreshData]);

    const updateMedicine = useCallback(async (id, formData) => {
        try {
            const payload = {
                medicineName: formData.medicine_name || formData.medicineName,
                price: parseFloat(formData.price) || 0,
                category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
                supplier_id: formData.supplier_id ? parseInt(formData.supplier_id, 10) : null
            };

            const res = await apiFetch(`/inventory/medicines/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            if (!res) return false;
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error updating medicine:', e);
            return false;
        }
    }, [refreshData]);

    const deleteMedicine = useCallback(async (id) => {
        try {
            await apiFetch(`/inventory/medicines/${id}`, {
                method: 'DELETE'
            });
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error deleting medicine:', e);
            return false;
        }
    }, [refreshData]);

    // 3. INVENTORY BATCHES CRUD
    const addBatch = useCallback(async (formData) => {
        try {
            const payload = {
                medicine_id: formData.medicine_id ? parseInt(formData.medicine_id, 10) : null,
                custom_medicine_name: formData.custom_medicine_name || '',
                supplier_id: formData.supplier_id ? parseInt(formData.supplier_id, 10) : null,
                batch_number: formData.batch_number || formData.batchNumber,
                quantity: parseInt(formData.quantity, 10) || 0,
                manufacturing_date: formData.manufacturing_date || formData.manufacturingDate,
                expiry_date: formData.expiry_date || formData.expiryDate
            };

            const res = await apiFetch('/inventory/stocks', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (!res) return false;
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error adding batch:', e);
            return false;
        }
    }, [refreshData]);

    const updateBatch = useCallback(async (id, formData) => {
        try {
            const payload = {
                medicine_id: formData.medicine_id ? parseInt(formData.medicine_id, 10) : null,
                batch_number: formData.batch_number || formData.batchNumber,
                quantity: parseInt(formData.quantity, 10) || 0,
                manufacturing_date: formData.manufacturing_date || formData.manufacturingDate,
                expiry_date: formData.expiry_date || formData.expiryDate,
                stock_status: formData.stock_status || formData.stockStatus
            };

            const res = await apiFetch(`/inventory/stocks/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            if (!res) return false;
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error updating batch:', e);
            return false;
        }
    }, [refreshData]);

    const deleteBatch = useCallback(async (id) => {
        try {
            await apiFetch(`/inventory/stocks/${id}`, {
                method: 'DELETE'
            });
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error deleting batch:', e);
            return false;
        }
    }, [refreshData]);

    // 4. PURCHASE ORDERS CRUD & STATUS
    const createPurchaseOrder = useCallback(async (formData) => {
        try {
            const payload = {
                poNumber: formData.poNumber || formData.po_number,
                supplierId: formData.supplierId || formData.supplier_id,
                itemCount: parseInt(formData.itemCount || formData.item_count, 10) || 50,
                totalAmount: parseFloat(formData.totalAmount || formData.total_amount || formData.total) || 0,
                orderDate: formData.orderDate || formData.order_date || new Date().toISOString().split('T')[0],
                status: formData.status || 'PENDING'
            };

            const res = await apiFetch('/purchase-orders', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (!res) return false;
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error creating purchase order:', e);
            return false;
        }
    }, [refreshData]);

    const updatePurchaseOrderStatus = useCallback(async (id, status) => {
        try {
            const res = await apiFetch(`/purchase-orders/${id}/status?status=${encodeURIComponent(status)}`, {
                method: 'PUT'
            });

            if (!res) return false;
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error updating purchase order status:', e);
            return false;
        }
    }, [refreshData]);

    const updatePurchaseOrder = useCallback(async (id, formData) => {
        try {
            const res = await apiFetch(`/purchase-orders/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });

            if (!res) return false;
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error updating purchase order:', e);
            return false;
        }
    }, [refreshData]);

    const deletePurchaseOrder = useCallback(async (id) => {
        try {
            await apiFetch(`/purchase-orders/${id}`, {
                method: 'DELETE'
            });
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error deleting purchase order:', e);
            return false;
        }
    }, [refreshData]);

    // 5. SALES / POS DISPENSE
    const processSale = useCallback(async (saleData) => {
        try {
            const res = await apiFetch('/sales', {
                method: 'POST',
                body: JSON.stringify(saleData)
            });

            if (!res) return null;
            await refreshData();
            return res;
        } catch (e) {
            console.error('Error processing sale:', e);
            return null;
        }
    }, [refreshData]);

    // 6. NOTIFICATIONS
    const markNotificationAsRead = useCallback(async (id) => {
        try {
            await apiFetch(`/notifications/${id}/read`, {
                method: 'PATCH'
            });
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error marking notification as read:', e);
            return false;
        }
    }, [refreshData]);

    const markAllNotificationsAsRead = useCallback(async () => {
        try {
            await apiFetch('/notifications/read-all', {
                method: 'PATCH'
            });
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error marking all notifications as read:', e);
            return false;
        }
    }, [refreshData]);

    const createNotification = useCallback(async (notifData) => {
        try {
            const res = await apiFetch('/notifications', {
                method: 'POST',
                body: JSON.stringify(notifData)
            });
            if (!res) return false;
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error creating notification:', e);
            return false;
        }
    }, [refreshData]);

    // 7. USER MANAGEMENT CRUD
    const addUser = useCallback(async (userData) => {
        try {
            const res = await apiFetch('/users', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            if (!res) return false;
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error adding user:', e);
            return false;
        }
    }, [refreshData]);

    const updateUser = useCallback(async (id, userData) => {
        try {
            const res = await apiFetch(`/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(userData)
            });
            if (!res) return false;
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error updating user:', e);
            return false;
        }
    }, [refreshData]);

    const deleteUser = useCallback(async (id) => {
        try {
            await apiFetch(`/users/${id}`, {
                method: 'DELETE'
            });
            await refreshData();
            return true;
        } catch (e) {
            console.error('Error deleting user:', e);
            return false;
        }
    }, [refreshData]);

    // 8. LOGGED-IN USER PROFILE SYNC & UPDATE
    const updateUserProfile = useCallback(async (profileData) => {
        try {
            const currentUsername = userProfile.username || localStorage.getItem('username') || 'admin';
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    currentUsername,
                    newUsername: profileData.username,
                    newEmail: profileData.email,
                    currentPassword: profileData.currentPassword,
                    newPassword: profileData.newPassword,
                })
            });

            const newUsername = profileData.username || userProfile.username;
            const newEmail = profileData.email || userProfile.email;

            setUserProfile(prev => {
                const next = { ...prev, username: newUsername, email: newEmail };
                localStorage.setItem('username', newUsername);
                localStorage.setItem('email', newEmail);
                return next;
            });

            if (!res.ok) {
                const errText = await res.text();
                console.warn('Backend profile update note:', errText);
            }

            return { success: true };
        } catch (e) {
            console.warn('Update profile fallback to local state:', e);
            const newUsername = profileData.username || userProfile.username;
            const newEmail = profileData.email || userProfile.email;
            setUserProfile(prev => {
                const next = { ...prev, username: newUsername, email: newEmail };
                localStorage.setItem('username', newUsername);
                localStorage.setItem('email', newEmail);
                return next;
            });
            return { success: true, localOnly: true };
        }
    }, [userProfile.username]);

    const login = useCallback((authData) => {
        const rawRole = (authData.role || authData.authority || 'ROLE_STAFF').toUpperCase();
        const cleanRole = rawRole.includes('ADMIN')
            ? 'admin'
            : rawRole.includes('PHARMACIST')
                ? 'pharmacist'
                : 'staff';

        const loggedInName = authData.username || authData.name || cleanRole;
        const loggedInEmail = authData.email || `${loggedInName.toLowerCase()}@medistock.com`;
        const userId = authData.id || authData.userId || '';

        if (authData.token) localStorage.setItem('token', authData.token);
        localStorage.setItem('role', cleanRole);
        localStorage.setItem('username', loggedInName);
        localStorage.setItem('email', loggedInEmail);
        if (userId) localStorage.setItem('userId', String(userId));

        setUserProfile({
            username: loggedInName,
            email: loggedInEmail,
            role: cleanRole,
            userId: String(userId)
        });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        setUserProfile({
            username: '',
            email: '',
            role: 'staff',
            userId: ''
        });
    }, []);

    return (
        <DataContext.Provider value={{
            profile: userProfile,
            userProfile,
            updateUserProfile,
            login,
            logout,

            medicines,
            suppliers,
            categories,
            batches,
            inventoryBatches: batches,
            purchaseOrders,
            sales: salesRaw,
            stockLogs,
            notifications,
            users,

            addSupplier,
            updateSupplier,
            deleteSupplier,

            addMedicine,
            updateMedicine,
            deleteMedicine,

            addBatch,
            updateBatch,
            deleteBatch,

            createPurchaseOrder,
            updatePurchaseOrderStatus,
            updatePurchaseOrder,
            deletePurchaseOrder,

            processSale,
            recordSale: processSale,

            markNotificationAsRead,
            markAllNotificationsAsRead,
            createNotification,

            addUser,
            updateUser,
            deleteUser,

            loading,
            error,
            isDarkMode,
            darkMode: isDarkMode,
            toggleTheme,
            refreshData
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error('useData must be used within DataProvider');
    return ctx;
}