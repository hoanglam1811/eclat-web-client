import axios from "axios";
import { BASE_URL } from "../../constants/api";

export async function createVnPayPayment(amount: number, orderInfo: string, orderId: number, token: string) {
    try {
        const response = await axios.get(`${BASE_URL}/payment/create`, {
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
        const response = await axios.get(`${BASE_URL}/payment/vnpay-return`, {
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