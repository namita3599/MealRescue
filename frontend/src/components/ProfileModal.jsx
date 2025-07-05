import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";

const ProfileModal = ({ open, handleClose }) => {
  const { user, setUser, logout } = useContext(AuthContext);

  const [editName, setEditName] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const resetFields = () => {
    setEditName(false);
    setEditPassword(false);
    setName(user?.name || "");
    setOldPassword("");
    setNewPassword("");
    setError("");
    setSuccess("");
  };

  const handleModalClose = () => {
    resetFields();
    handleClose();
  };
  

  const handleNameUpdate = async () => {
    try {
      setError(""); // Clear any previous errors
      setSuccess(""); // Clear any previous success messages
      
      await axios.patch("/profile/edit-name", { name });
      setUser((prev) => ({ ...prev, name }));
      setSuccess("Name updated successfully!");
      setEditName(false);
    } catch (err) {
      console.error("Name update error:", err);
      setError("Failed to update name.");
      setSuccess("");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      setError(""); // Clear any previous errors
      setSuccess(""); // Clear any previous success messages

      await axios.patch("/profile/change-password", {
        currentPassword: oldPassword, 
        newPassword,
      });
      setSuccess("Password updated successfully!");
      setEditPassword(false);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Password update error:", err);
      
      // Handle different error responses
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || "Unknown error";
        
        if (status === 401) {
          setError("Incorrect current password. Please try again.");
        } else if (status === 400) {
          setError("Invalid request. Please check your input.");
        } else if (status === 404) {
          setError("User not found. Please try logging in again.");
        } else {
          setError(`Failed to update password: ${message}`);
        }
      } else {
        setError("Network error. Please check your connection.");
      }
      setSuccess("");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

    try {
      await axios.delete("/profile/delete-account");
      logout(); // from context
    } catch (err) {
      setError("Failed to delete account. Please try again.");
    }
  };


  const handleCancelName = () => {
    setEditName(false);
    setName(user?.name || "");
    setError(""); // Clear error message
    setSuccess(""); // Clear success message
  };

  const handleCancelPassword = () => {
    setEditPassword(false);
    setOldPassword("");
    setNewPassword("");
    setError(""); // Clear error message
    setSuccess(""); // Clear success message
  };

  return (
    <Dialog open={open}
     onClose={handleModalClose} 
     fullWidth maxWidth="sm" 
     disableRestoreFocus={true}
     keepMounted={false} >
      <DialogTitle>My Profile</DialogTitle>
      <DialogContent>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={3}>
          {/* NAME SECTION */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {!editName ? (
              <>
                <Typography>
                  <strong>Name:</strong> {user?.name}
                </Typography>
                <IconButton onClick={() => setEditName(true)} size="small">
                  <EditIcon />
                </IconButton>
              </>
            ) : (
              <>
                <TextField
                  label="Edit Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
                <Box display="flex" gap={1} mt={1}>
                  <Button variant="outlined" onClick={handleCancelName}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleNameUpdate}>
                    Save
                  </Button>
                </Box>
              </>
            )}
          </Box>

          {/* EMAIL SECTION */}
          <Typography>
            <strong>Email:</strong> {user?.email}
          </Typography>

          {/* ROLE SECTION */}
          <Typography>
            <strong>Role:</strong> {user?.role}
          </Typography>

          {/* PASSWORD SECTION */}
          <Box display="flex" justifyContent="space-between">
            <Typography>
              <strong>Password:</strong> ••••••••
            </Typography>
            <IconButton onClick={() => setEditPassword(true)} size="small">
              <EditIcon />
            </IconButton>
          </Box>

          {editPassword && (
            <Stack spacing={2}>
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Box display="flex" gap={1}>
                <Button variant="outlined" onClick={handleCancelPassword}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handlePasswordUpdate}>
                  Update Password
                </Button>
              </Box>
            </Stack>
          )}

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteAccount}
          startIcon={<DeleteIcon />}
        >
          Delete Account
        </Button>

        <Button onClick={handleModalClose}>Close</Button>
      </DialogActions>

    </Dialog>
  );
};

export default ProfileModal;