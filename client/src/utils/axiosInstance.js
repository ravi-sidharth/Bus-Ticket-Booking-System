import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://ind.idv.hyperverge.co/v1",
  headers: {
    "Content-Type": "multipart/form-data",
    appId:import.meta.env.VITE_APPID ,
    appKey: import.meta.env.VITE_APPKEY
  },
});

axiosInstance.interceptors.request.use((config) => {
  config.headers["transactionId"] = "txn-" + Date.now(); 
  return config;
});

export default axiosInstance