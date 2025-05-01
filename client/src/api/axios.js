import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_BACKEND_ROUTE || 'http://localhost:3500',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});