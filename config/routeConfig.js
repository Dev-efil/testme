import axios from 'axios';
const BASE_URL = 'https://api.yobot.ogilvydigital.net';

export default axios.create({
    baseURL: BASE_URL
});