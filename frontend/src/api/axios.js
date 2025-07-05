import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  // withCredentials: true 
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Handle token expiry (or any 401 error)
instance.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.config?.skipAuth || error.config?.url?.includes('/profile/change-password')) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);


export default instance;
