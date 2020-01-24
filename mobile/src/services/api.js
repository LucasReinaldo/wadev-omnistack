import axios from 'axios';

//se usar pelo cel, colocar o ip do expo, se for android ver qual o ip.
const api = axios.create({
    baseURL: 'http://localhost:3333', 
});

export default api;