import axios from "axios";

const API = "http://localhost:8081/api/history";

export const getHistory=()=>axios.get(API);