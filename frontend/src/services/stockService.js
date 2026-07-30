import axios from "axios";

const API = "http://localhost:8080/api/inventory";

export const getInventory = (token) => {
    return axios.get(API, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const updateInventory = (id, data, token) => {
    return axios.put(
        `${API}/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};