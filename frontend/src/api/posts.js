import api from './axiosClient';

export const getPosts = (page = 0, size = 10) => api.get(`/posts?page=${page}&size=${size}`);
export const createPost = (content, images) => {
	const formData = new FormData();
	formData.append('content', content);
	images.forEach((image) => formData.append('images', image));
	return api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
