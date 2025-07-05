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
  Switch
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import postService from "../services/postService";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); //Track which post is expanded

  const [cityQuery, setCityQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false); 

  const [showVeg, setShowVeg] = useState(true);
  const [showNonVeg, setShowNonVeg] = useState(true);

  const filteredPosts = posts.filter((post) => {
  const isVeg = post.isVeg === true || post.isVeg === "true";
  if (isVeg && showVeg) return true;
  if (!isVeg && showNonVeg) return true;
  return false;
});


  const fetchPosts = async (city = "") => {
    setLoading(true);

    try {
      if (user.role === 'ngo') {
        if (!city.trim()) {
          setPosts([]);
          setHasSearched(false);
          setLoading(false);
          return;
        }

        const res = await postService.getUnclaimedPosts(city.trim());
        setPosts(res.data);
        setHasSearched(true);
      } else {
        const res = await postService.getMyPosts();
        setPosts(res.data);
      }

    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'ngo') {
        // For NGOs, stop loading immediately since they need to search first
        setLoading(false);
      } else {
        // For non-NGO users, fetch their posts
        fetchPosts();
      }
    }
  }, [user]);

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h6" align="center">
          Please log in to view your posts.
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

    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" mb={3}>
          {user.role === 'ngo' ? 'Unclaimed Posts' : 'Your Posts'}
        </Typography>

        {user.role === 'ngo' && (

          <>

          <Box mb={3} display="flex" gap={2}>
            <input
              type="text"
              placeholder="Enter city"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              style={{ padding: '8px', flex: 1 }}
            />
            <Button variant="contained" onClick={() => fetchPosts(cityQuery)}>
              Search
            </Button>
          </Box>

          <Box display="flex" gap={4} alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
          <Typography>Veg</Typography>
          <Switch
            checked={showVeg}
            onChange={() => {
              if (!showNonVeg) return; // prevent both OFF
              setShowVeg(!showVeg);
            }}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'green',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'green',
              },
            }}
          />
        </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Non-Veg</Typography>
            <Switch
              checked={showNonVeg}
              onChange={() => {
                if (!showVeg) return; // prevent both OFF
                setShowNonVeg(!showNonVeg);
              }}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'red',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'red',
                },
              }}
            />
          </Box>
        </Box>

    </>

      )}

      {user.role === 'ngo' && !hasSearched && (
        <Typography variant="h6" align="center" sx={{ width: "100%", mt: 2 }}>
          Search for posts in your city to see available food.
        </Typography>
      )}

      {user.role === 'ngo'&& hasSearched && posts.length === 0 && (
        <Typography variant="h6" align="center" sx={{ width: "100%", mt: 2 }}>
          No posts found.
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "flex-start",
        }}
      >
        {filteredPosts.map((post) => (
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
                {post.claimed ? (
                  <Chip label="Claimed" color="warning" />
                ) : (
                  <Chip label="Unclaimed" color="primary" />
                )}
              </Box>

              <Typography variant="body2">
                Posted on: {formatDate(post.createdAt)}
              </Typography>

              {user.role === "ngo" && post.user && (
                <Typography variant="body2">
                  Posted by: {post.user.name}
                </Typography>
              )}

              <Typography variant="body2" mt={1}>
                Quantity: {post.quantity}
              </Typography>

              <Typography variant="body2">
                Address: {post.address}
              </Typography>


            {!post.claimed && user.role === 'ngo' && (
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={async () => {
                  try {
                    await postService.claimPost(post._id);
                    fetchPosts(cityQuery); // Refresh list
                  } catch (err) {
                    console.error("Error claiming post:", err);
                  }
                }}
                sx={{ mt: 1 }}
                >
                  Claim
                </Button>
              )}

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

export default HomePage;