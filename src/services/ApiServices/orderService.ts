import axios from "axios";
import { BASE_URL } from "../../constants/api";

// Tạo đơn hàng
export async function createOrder(orderData: any, token: string) {
    try {
        const response = await axios.post(`${BASE_URL}/orders/create`, orderData, {
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