const ENV = import.meta.env.NODE_ENV || 'development';

const config = {
    development: {
        API_URL: 'http://localhost:8000/api',
    },
    production: {
        API_URL: 'https://vteam14-backend.onrender.com/api',
    },
    test: {
        API_URL: 'http://localhost:8000/api',
    },
};

export const API_URL = config[ENV].API_URL;
