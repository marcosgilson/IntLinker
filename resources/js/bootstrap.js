import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.content || '';

window.axios.interceptors.response.use(
    response => response,
    async error => {
        const config = error.config;
        if (!config || config._retried) {
            window.location.reload();
            return Promise.reject(error);
        }
        config._retried = true;
        try {
            return await axios(config);
        } catch (retryError) {
            window.location.reload();
            return Promise.reject(retryError);
        }
    }
);
