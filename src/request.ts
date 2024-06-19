import axios, {AxiosInstance} from "axios";

// 环境判断
export const isDev = process.env.NODE_ENV === "development";
const myAxios: AxiosInstance = axios.create({
  baseURL: isDev ? "http://localhost:8101" : "http://101.43.118.143:8101",
  timeout: 60000,
  withCredentials: true, // 请求携带cookie
});
// todo 请求拦截限制
// 添加全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加全局响应拦截器，建议在响应拦截器就将所有错误拦截
myAxios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default myAxios;
