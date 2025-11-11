import api from './axiosClient';

export const getPosts = (page = 0, size = 10) => api.get(`/posts?page=${page}&size=${size}`);
export const createPost = (content, imageUrl) => api.post('/posts', { content, imageUrl });
