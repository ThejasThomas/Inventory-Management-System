import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/user_slice"
import productReducer from "./slices/product_slice"
export const store =configureStore({
    reducer:{
        auth:authReducer,
        products:productReducer
    }
})

export type RootState =ReturnType<typeof store.getState>;
export type AppDispath =typeof store.dispatch;