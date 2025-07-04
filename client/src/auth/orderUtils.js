import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api';

export const getOrders = (token) => {
  return axios.get(`${API_URL}/orders`, {
    headers: {
      authtoken: token,
    },
  });
};
