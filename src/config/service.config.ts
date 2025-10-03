import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8200/compras-ventas/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

//TODO add config interceptor token ...