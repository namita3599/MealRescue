import axios from '../api/axios';

const register = (data) => axios.post('/auth/register', data);
const login = (data) => axios.post('/auth/login', data);

const authService = { register, login };
export default authService;