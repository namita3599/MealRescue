import axios from '../api/axios';

const register = (data) => axios.post('/auth/register', data);

const authService = { register };
export default authService;
