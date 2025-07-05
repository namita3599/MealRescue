import React, { useContext, useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  CircularProgress,
  FormControlLabel,
  Switch,
  Paper,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import postService from "../services/postService";
import { useNavigate } from "react-router-dom";

const CreatePostPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    quantity: "",
    city: "",
    address: "",
    isVeg: true,
    description: "",
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVegToggle = () => {
    setForm({ ...form, isVeg: !form.isVeg });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      setError("Please upload a photo.");
      return;
    }

    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }
    formData.append("photo", photo);

    setLoading(true);
    setError("");

    try {
      await postService.createPost(formData);
      navigate("/");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h6" align="center">
          Please log in to create a post.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Create a Food Post
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            required
            margin="normal"
            value={form.title}
            onChange={handleChange}
          />

          <Box mt={2}>
            <Button variant="outlined" component="label" fullWidth>
              {photo ? `Photo: ${photo.name}` : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </Button>
          </Box>

          <TextField
            label="Quantity"
            name="quantity"
            fullWidth
            required
            margin="normal"
            value={form.quantity}
            onChange={handleChange}
          />
          <TextField
            label="City"
            name="city"
            fullWidth
            required
            margin="normal"
            value={form.city}
            onChange={handleChange}
          />
          <TextField
            label="Address"
            name="address"
            fullWidth
            required
            margin="normal"
            value={form.address}
            onChange={handleChange}
          />

          <Box mt={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isVeg}
                  onChange={handleVegToggle}
                  color="success"
                />
              }
              label={form.isVeg ? "Vegetarian" : "Non-Vegetarian"}
            />
          </Box>

          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={form.description}
            onChange={handleChange}
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Create Post"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePostPage;
