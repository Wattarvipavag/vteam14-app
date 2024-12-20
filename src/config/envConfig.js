const ENV = process.env.NODE_ENV || 'development';

const config = {
    development: {
        API_URL: 'http://localhost:8000/api',
    },
    production: {
        API_URL: 'https://vteam14-backend.onrender.com/api',
    },
};

export const API_URL = config[ENV].API_URL;
