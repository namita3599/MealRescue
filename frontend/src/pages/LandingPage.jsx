import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/bg-food.jpg')", //image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
          textAlign: "center",
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: 4,
          p: 4,
          boxShadow: 6,
        }}
      >
        <img src="/logo.png" alt="Meal Rescue Logo" style={{ height: 80, marginBottom: 20 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Meal Rescue
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Connecting leftover food to those who need it most. Reduce food waste, one meal at a time.
        </Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" component={Link} to="/login">
            Login
          </Button>
          <Button variant="outlined" component={Link} to="/register">
            Register
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
