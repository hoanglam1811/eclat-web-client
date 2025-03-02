import axios from "axios";
import { BASE_URL } from "../../constants/api";

export async function createVnPayPayment(amount: number, orderInfo: string, orderId: number, token: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/payment/create`, {
            params: {
                amount,
                orderInfo,
                orderId
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create VNPAY payment:", error);
        throw error;
    }
}

export async function handleVnPayReturn(queryParams: URLSearchParams, token: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/payment/vnpay-return`, {
            params: Object.fromEntries(queryParams.entries()),
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to handle VNPAY return:", error);
        throw error;
    }
}

// Lấy danh sách tất cả giao dịch
export async function getAllTransactions(token: any) {
    try {
        const response = await axios.get(`${BASE_URL}/api/payment`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        throw error;
    }
}

// Lấy giao dịch theo ID
export async function getTransactionById(transactionId: any, token: any) {
    try {
        const response = await axios.get(`${BASE_URL}/api/payment/${transactionId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch transaction by ID:", error);
        throw error;
    }
}

// Lấy danh sách giao dịch của một người dùng theo userId
export async function getTransactionsByUserId(userId: any, token: any) {
    try {
        const response = await axios.get(`${BASE_URL}/api/payment/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch transactions by user ID:", error);
        throw error;
    }
}
