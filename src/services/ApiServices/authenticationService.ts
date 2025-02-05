import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function login(username:any, password:any) {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/log-in`,
      { username, password },
      ngrokSkipWarning
    );
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function register(username:any, email:any, password:any, phoneNum:any) {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/register`,
      { username, email, password, phoneNum },
      ngrokSkipWarning
    );
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

export async function verifyUser(email:any) {
  try {
    const response = await axios.get(
      `${BASE_URL}/auth/verify`,
      { params: { email } },
    );
    return response.data;
  } catch (error) {
    console.error("Verification failed:", error);
    throw error;
  }
}