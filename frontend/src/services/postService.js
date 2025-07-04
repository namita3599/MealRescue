import axios from '../api/axios';

const getMyPosts = () => axios.get('/profile/my-posts');
const getUnclaimedPosts = (city) => axios.get(`/posts?city=${city}`);

const postService = { getMyPosts, getUnclaimedPosts };
export default postService;
