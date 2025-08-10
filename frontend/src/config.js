const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL || '/api'
    : 'http://localhost:5000/api'
};

export default config;