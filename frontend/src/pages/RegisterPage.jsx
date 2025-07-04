import React, { useState } from 'react';
import { TextField, Button, MenuItem, Typography, Box } from '@mui/material';
import authService from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // console.log(formData);

    try {
      const res = await authService.register(formData);
      setSuccess('Registered successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={5} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2}>Register</Typography>

      {error && <Typography color="error" mb={2}>{error}</Typography>}
      {success && <Typography color="primary" mb={2}>{success}</Typography>}

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
    </Box>
  );
};

export default RegisterPage;
