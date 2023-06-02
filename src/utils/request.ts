import axios, {AxiosInstance} from "axios";
// @ts-ignore
import qs from 'qs';

 axios.defaults.baseURL = ''  //正式
//axios.defaults.baseURL = 'http://localhost:8080' //测试

//post请求头
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
 // @ts-ignore

// @ts-ignore
//允许跨域携带cookie信息
axios.defaults.withCredentials = false;
//设置超时
const service:AxiosInstance = axios.create({
    timeout: 5000
});

axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        console.log(JSON.stringify(error));
    }
);
export default {
    /**
     * @param {String} url
     * @param {Object} data
     * @returns Promise
     */
    post(url:string, data:object) {
        // @ts-ignore
        axios.defaults.headers.post["Authorization"] = localStorage.getItem("Authorization");
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url,
                data: qs.stringify(data),
            })
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                });
        })
    },

    get(url:string, data:object) {
        // @ts-ignore
        axios.defaults.headers.get["Authorization"] = localStorage.getItem("Authorization");
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url,
                params: data,
            })
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
};
