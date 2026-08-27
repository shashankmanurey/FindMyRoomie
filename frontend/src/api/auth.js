import api from './axiosClient';

export const register = (payload) => api.post('/auth/register', payload);
export const login = (email, password) => api.post('/auth/login', { email, password });
export const refresh = (refreshToken) => api.post('/auth/refresh', { refreshToken });
export const logout = (email) => api.post('/auth/logout', { email });
export const me = () => api.get('/users/me');
