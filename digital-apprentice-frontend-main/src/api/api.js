import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

// Auth functions
export const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};

export const signup = async (email, password, username) => {
  const response = await API.post('/auth/signup', { email, password, username });
  return response.data;
};

export const chat = async (message) => {
  const response = await API.post('/chat/', { message });
  return response.data;
};

export default API;