import axios from '../api/axios';

const getMyPosts = () => axios.get('/profile/my-posts');
const getUnclaimedPosts = (city) => axios.get(`/posts?city=${city}`);
const getClaimedPostsByNgo= () => axios.get("/profile/claimed-posts");
const claimPost = (postId) => axios.patch(`/posts/${postId}/claim`);


const postService = { getMyPosts, getUnclaimedPosts, getClaimedPostsByNgo, claimPost };
export default postService;
