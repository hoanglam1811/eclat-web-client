import axios from "axios";
import { BASE_URL } from "../../constants/api";

// Lấy tất cả sản phẩm
export async function getAllProducts(token: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/Products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
}

// Lấy thông tin sản phẩm theo ID
export async function getProductById(id: number, token: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/Products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    throw error;
  }
}

// Thêm mới sản phẩm
export async function addProduct(productData: any, token: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/Products/insert`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add product:", error);
    throw error;
  }
}

// Cập nhật sản phẩm theo ID
export async function updateProduct(id: number, productData: any, token: string) {
  try {
    const response = await axios.put(`${BASE_URL}/api/Products/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update product with ID ${id}:`, error);
    throw error;
  }
}

// Xóa sản phẩm theo ID
export async function deleteProduct(id: number, token: string) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/Products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete product with ID ${id}:`, error);
    throw error;
  }
}

// Tìm kiếm sản phẩm theo tên
export async function searchProducts(name: string, token: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/Products/search`, {
      params: { name },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to search products with name ${name}:`, error);
    throw error;
  }
}

export async function uploadImage(file: any, token: any, productId: any, optionId: any) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (productId) {
      formData.append("productId", productId);
    }
    if (optionId) {
      formData.append("optionId", optionId);
    }

    const response = await axios.post(`${BASE_URL}/api/Products/upload-image`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to upload image:", error);
    throw error;
  }
}
