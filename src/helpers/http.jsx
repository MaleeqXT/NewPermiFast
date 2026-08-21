import axios from "axios";

const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  
  // headers: {
  //   'Accept': 'application/json',
  //   'Content-Type': 'application/json',
  // }
});

// The backend issues a Sanctum token during login. Add it to every API call so
// the session remains valid after React redirects to a protected dashboard.
http.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("ppf_auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default http;
