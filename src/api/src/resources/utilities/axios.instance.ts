import axios from 'axios';

const axiosRetry = require('axios-retry');

const MAX_REQUESTS_COUNT = 10;
const INTERVAL_MS = 10;
let PENDING_REQUESTS = 0;

// create new axios instance
const api = axios.create({
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    }
});

/**
 * Axios Request Interceptor
 */
api.interceptors.request.use(function (config) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
                PENDING_REQUESTS++;
                clearInterval(interval);
                resolve(config)
            }
        }, INTERVAL_MS)
    })
});

/**
 * Axios Response Interceptor
 */
api.interceptors.response.use(function (response) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.resolve(response)
}, function (error) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.reject(error)
});

axiosRetry(api, {retries: 5, retryDelay: axiosRetry.exponentialDelay});

export default api
