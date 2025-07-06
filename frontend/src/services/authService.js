import axios from '../api/axios';

const register = (data) => axios.post('/auth/register', data);
const verifyOTP = (data) => axios.post('/auth/verify-otp', data);
const login = (data) => axios.post('/auth/login', data);

const authService = { register, verifyOTP, login };
export default authService;