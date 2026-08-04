import api from "./api";

/*
|--------------------------------------------------------------------------
| Get All Purchase Orders
|--------------------------------------------------------------------------
*/

export const getPurchaseOrders = async () => {

    const response = await api.get("/purchase-orders");

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Get Purchase Order By ID
|--------------------------------------------------------------------------
*/

export const getPurchaseOrderById = async (orderId) => {

    const response = await api.get(`/purchase-orders/${orderId}`);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Add Purchase Order
|--------------------------------------------------------------------------
*/

export const addPurchaseOrder = async (purchaseOrderData) => {

    const response = await api.post(
        "/purchase-orders",
        purchaseOrderData
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Update Purchase Order
|--------------------------------------------------------------------------
*/

export const updatePurchaseOrder = async (
    orderId,
    purchaseOrderData
) => {

    const response = await api.put(
        `/purchase-orders/${orderId}`,
        purchaseOrderData
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Delete Purchase Order
|--------------------------------------------------------------------------
*/

export const deletePurchaseOrder = async (orderId) => {

    await api.delete(`/purchase-orders/${orderId}`);

};

/*
|--------------------------------------------------------------------------
| Get Purchase Order Summary
|--------------------------------------------------------------------------
*/

export const getPurchaseOrderSummary = async () => {

    const response = await api.get(
        "/purchase-orders/summary"
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Search By Status
|--------------------------------------------------------------------------
*/

export const getPurchaseOrdersByStatus = async (
    status
) => {

    const response = await api.get(
        `/purchase-orders/status/${status}`
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Search By Supplier
|--------------------------------------------------------------------------
*/

export const getPurchaseOrdersBySupplier = async (
    supplierId
) => {

    const response = await api.get(
        `/purchase-orders/supplier/${supplierId}`
    );

    return response.data;

};