import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";

const service: AxiosInstance = axios.create({
    baseURL: 2 > 1 ? 'https://api.lshbosheth.cn/api' : 'http://localhost:1222/api',
    timeout: 60 * 1000, // 请求超时时间
    // headers: { "Content-Type": "application/json;charset=UTF-8" },
    responseType: 'json'
});

service.interceptors.response.use((response: AxiosResponse) => {
        const data = response.data;
        return data;
    },
    (err) => {
        return Promise.reject(err.response);
    }
);

const request = {
    get<T = any>(url: string, data?: any): Promise<T> {
        return request.request("GET", url, { params: data });
    },
    post<T = any>(url: string, data?: any): Promise<T> {
        return request.request("POST", url, { data });
    },
    put<T = any>(url: string, data?: any): Promise<T> {
        return request.request("PUT", url, { data });
    },
    delete<T = any>(url: string, data?: any): Promise<T> {
        return request.request("DELETE", url, { params: data });
    },
    request<T = any>(method = "GET", url: string, data?: any): Promise<T> {
        return new Promise((resolve, reject) => {
            service({ method, url, ...data })
                .then((res) => {
                    resolve(res as unknown as Promise<T>);
                })
                .catch((e: Error | AxiosError) => {
                    reject(e);
                })
        });
    }
};

export default request;
