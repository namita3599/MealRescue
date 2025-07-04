import React from 'react'

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); //Track which post is expanded

  const [cityQuery, setCityQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false); 

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

  // Show different messages based on user role and search state
  if (posts.length === 0) {
    if (user.role === 'ngo' && !hasSearched) {
      return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
          <Typography variant="h5" mb={3}>Search for Posts</Typography>
          <Box mb={3} display="flex" gap={2}>
            <input
              type="text"
              placeholder="Enter city"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter") {
              //     e.preventDefault();
              //     fetchPosts(cityQuery);
              //   }
              // }}
              style={{ padding: '8px', flex: 1 }}
            />
            <Button variant="contained" onClick={() => fetchPosts(cityQuery)}>
              Search
            </Button>
          </Box>
          <Typography variant="h6" align="center">
            Enter a city name to search for unclaimed posts.
          </Typography>
        </Container>
      );
    } else {
      return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
          <Typography variant="h6" align="center">
            No posts found.
          </Typography>
        </Container>
      );
    }
  }

  return (
    <div>HomePage</div>
  )
}

export default HomePage