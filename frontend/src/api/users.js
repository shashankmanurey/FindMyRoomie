import axios from './axiosClient';

export const getAllUsers = () => axios.get('/users'); // optional: if backend exposes list
export const getUser = (id) => axios.get(`/users/${id}`);
export const updateMe = (payload) => axios.put('/users/me', payload);
