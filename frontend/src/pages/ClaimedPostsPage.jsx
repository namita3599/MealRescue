import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  CircularProgress,
  Box,
  Button,
  Collapse,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import postService from "../services/postService";

const ClaimedPosts = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchClaimedPosts = async () => {
    setLoading(true);
    try {
      const res = await postService.getClaimedPostsByNgo(); 
      // console.log("Claimed posts response:", res.data);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching claimed posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ngo") {
      fetchClaimedPosts();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user || user.role !== "ngo") {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h6" align="center">
          Only NGOs can view claimed posts.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (posts.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h6" align="center">
          You haven't claimed any posts yet.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" mb={3}>
        Claimed Posts
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "flex-start",
        }}
      >
        {posts.map((post) => (
          <Card
            key={post._id}
            sx={{
              width: 320,
              borderRadius: 3,
              boxShadow: 4,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>{post.title}</Typography>

              <CardMedia
                component="img"
                image={post.photo}
                alt={post.title}
                sx={{
                  maxHeight: 200,
                  maxWidth: "100%",
                  borderRadius: 2,
                  mb: 2,
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback.jpg";
                }}
              />

              <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                <Chip label={`City: ${post.city}`} />
                <Chip
                  label={post.isVeg ? "Veg" : "Non-Veg"}
                  color={post.isVeg ? "success" : "error"}
                />
                <Chip label="Claimed" color="warning" />
              </Box>

              <Typography variant="body2" mt={1}>
                Quantity: {post.quantity}
              </Typography>

              <Typography variant="body2">
                Address: {post.address}
              </Typography>

              <Box mt={1}>
                <Button
                  size="small"
                  sx={{ textTransform: "none" }}
                  onClick={() =>
                    setExpandedId(expandedId === post._id ? null : post._id)
                  }
                >
                  {expandedId === post._id ? "Hide Description" : "Show Description"}
                </Button>
                <Collapse in={expandedId === post._id}>
                  <Box
                    mt={1}
                    sx={{
                      maxHeight: 80,
                      overflowY: "auto",
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                      p: 1,
                    }}
                  >
                    <Typography variant="body2">{post.description}</Typography>
                  </Box>
                </Collapse>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default ClaimedPosts;
