import axios from '../api/axios';

const getMyPosts = () => axios.get('/profile/my-posts');
const getUnclaimedPosts = (city) => axios.get(`/posts?city=${city}`);
const getClaimedPostsByNgo= () => axios.get("/profile/claimed-posts");
const claimPost = (postId) => axios.patch(`/posts/${postId}/claim`);
const createPost = (formData) =>
  axios.post('/posts/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

const postService = { getMyPosts, getUnclaimedPosts, getClaimedPostsByNgo, claimPost, createPost };
export default postService;
