import React, { useState, useContext } from 'react'; 
import { TextField, Button, MenuItem, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import authService from '../services/authService';
import { AuthContext } from "../context/AuthContext"; 
import VerifyEmailModal from "../components/VerifyEmailModal";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempUser, setTempUser] = useState(null);
  const [actualOtp, setActualOtp] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Reset previous state on every submit
    setShowModal(false);

    try {
      const res = await authService.register(formData);
      // Save OTP and temp user details
      setActualOtp(res.data.otp);
      setTempUser(res.data.tempUser);
      setShowModal(true); // open verification modal
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerificationSuccess = async () => {
    try {
      // Once verified, auto-login
      const res = await authService.login({
        email: formData.email,
        password: formData.password
      });

      const { token, user } = res.data;
      login(token, user);

      // Reset everything
      setFormData({ name: '', email: '', password: '', role: 'user' });
      setShowModal(false);
      setActualOtp('');
      setTempUser(null);

      navigate('/');
    } catch (err) {
      setError('Verified, but login failed. Please try logging in.');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={5} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2}>Register</Typography>

      {error && <Typography color="error" mb={2}>{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <TextField
          select
          label="Role"
          name="role"
          fullWidth
          margin="normal"
          value={formData.role}
          onChange={handleChange}
        >
          <MenuItem value="user">non-NGO</MenuItem>
          <MenuItem value="ngo">NGO</MenuItem>
        </TextField>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </form>

      {/* OTP Modal */}
      <VerifyEmailModal
        open={showModal}
        handleClose={() => setShowModal(false)}
        onVerified={handleVerificationSuccess}
        tempUser={tempUser}
        actualOtp={actualOtp}
      />
    </Box>
  );
};

export default RegisterPage;
