import axios, { AxiosError, AxiosResponse } from 'axios';

const createAxiosInstance = () => {
    return axios.create({
        baseURL: import.meta.env.VITE_APP_API_BASE_URL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    });
};

const responseSuccessMiddleware = (response: AxiosResponse): AxiosResponse => {
    return response;
};

const responseErrorMiddleware = (error: AxiosError): Promise<never> => {
    if (error.request instanceof XMLHttpRequest && error.request.responseURL.includes("Account/Login")) {
        localStorage.removeItem("u_data");
        window.location.replace(window.location.protocol + "//" + window.location.host + "/login");
    }
    return Promise.reject(error)
};

const axiosInstance = createAxiosInstance();
axiosInstance.interceptors.response.use(responseSuccessMiddleware, responseErrorMiddleware);

export default axiosInstance;