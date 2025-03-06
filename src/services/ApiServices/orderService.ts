import axios from "axios";
import { BASE_URL } from "../../constants/api";

const API_URL = `${BASE_URL}/api/orders`;

// Tạo đơn hàng
export async function createOrder(orderData: any, token: string) {
    try {
        const response = await axios.post(`${API_URL}/create`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create order:", error);
        throw error;
    }
}

// Lấy tất cả đơn hàng
export async function getAllOrders(token: string) {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        throw error;
    }
}

// Lấy đơn hàng theo ID
export async function getOrderById(orderId: number, token: string) {
    try {
        const response = await axios.get(`${API_URL}/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch order with ID ${orderId}:`, error);
        throw error;
    }
}

// Lấy danh sách đơn hàng theo User ID
export async function getOrdersByUserId(userId: string, token: string) {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch orders for user ${userId}:`, error);
        throw error;
    }
}
