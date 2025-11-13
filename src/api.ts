import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tpcicd-master.onrender.com', // will call relative endpoints like /authors, /books, etc.
});

export default api;
