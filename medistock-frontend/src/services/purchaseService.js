import axios from "axios";

const API = "http://localhost:8081/api/purchases";

export const getPurchases=()=>axios.get(API);

export const addPurchase=(purchase)=>
axios.post(API,purchase);

export const deletePurchase=(id)=>
axios.delete(`${API}/${id}`);
export const getPurchaseCount = () =>
    axios.get(`${API}/count`);