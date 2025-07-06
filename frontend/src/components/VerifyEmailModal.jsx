import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  Typography,
} from "@mui/material";
import authService from "../services/authService";

//using authService for axios

const VerifyEmailModal = ({ open, handleClose, onVerified, tempUser, actualOtp }) => {
  const [otpInput, setOtpInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      const res = await authService.verifyOTP({
        otpInput,
        actualOtp,
        tempUser,
      });

      setMessage(res.data.message);
      setError("");

      onVerified(); // Auto-login and redirect
      setOtpInput(""); // Clear input
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
      setMessage("");
    }
  };

  return (
    <Dialog open={open} 
    onClose={handleClose} 
    fullWidth 
    maxWidth="sm" 
    disableRestoreFocus={true}>
      <DialogTitle>Email Verification</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>Please enter the OTP sent to your email.</Typography>
          <TextField
            label="Enter OTP"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            fullWidth
          />
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleVerify} variant="contained">
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifyEmailModal;