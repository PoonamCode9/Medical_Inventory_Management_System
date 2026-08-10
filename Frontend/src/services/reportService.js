import api from "./api";

const getDashboardReport = async () => {
    const { data } = await api.get("/reports/dashboard");
    return data;
};

export default {
    getDashboardReport
};