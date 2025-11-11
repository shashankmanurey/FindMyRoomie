import api from './axiosClient';

export const register = (name, email, password) => api.post('/auth/register', { name, email, password });
export const login = (email, password) => api.post('/auth/login', { email, password });
export const refresh = (refreshToken) => api.post('/auth/refresh', { refreshToken });
export const logout = (email) => api.post('/auth/logout', { email });
export const me = () => api.get('/users/me');
