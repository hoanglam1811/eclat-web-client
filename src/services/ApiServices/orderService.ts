import axios from "axios";
import { BASE_URL } from "../../constants/api";

// Tạo đơn hàng
export async function createOrder(orderData: any, token: string) {
    try {
        const response = await axios.post(`${BASE_URL}/api/orders/create`, orderData, {
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

export async function getOrders(token: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/orders`, {
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
