import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:50',
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiImage = axios.create({
    baseURL: 'http://localhost:50',
    headers: {
        'Content-Type': 'multipart/form-data',
    },
})

export {api, apiImage};