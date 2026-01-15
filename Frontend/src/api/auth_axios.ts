import axios from 'axios';
import { store } from '../store/store';
import { clearUser } from '../store/slices/user_slice';

export const authAxiosInstance =axios.create({
    baseURL:import.meta.env.VITE_AUTH_API_URI,
    withCredentials:true
})

authAxiosInstance.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response?.status===401){
            store.dispatch(clearUser());

        }
        return Promise.reject(error)
    }
)