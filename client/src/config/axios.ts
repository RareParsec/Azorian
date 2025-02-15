import axios from "axios";
import { auth } from "./firebase";

const customAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
});

customAxios.defaults.headers.post["Content-Type"] = "application/json";

customAxios.interceptors.request.use(
  async (config) => {
    const forceTokenRefresh = config.headers.forceTokenRefresh || false;
    console.log("refreshing token:", forceTokenRefresh);
    const token = auth.currentUser?.getIdToken(forceTokenRefresh);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default customAxios;
