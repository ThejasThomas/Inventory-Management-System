import { authAxiosInstance } from "../api/auth_axios";
import type {  IGetCustomerData } from "../types/customer_type";
import type { ITemReportResponse } from "../types/item_report_type";
import type { IProductData } from "../types/product_types";
import type { IAddCustomersResponse, IAddProductResponse, IAxiosResponse, IGetCustomersResponse, IGetMyProductsResponse, IGetProductByIdResponse } from "../types/Response/response";
import type {  ILoginData, UserDTO } from "../types/user_types";


export const refreshSession =async():Promise<IAxiosResponse> =>{
    const response =await authAxiosInstance.get<IAxiosResponse>(
        "/refresh-session"
    )
    return response.data;
}
export const signup = async(user:UserDTO):Promise<IAxiosResponse>=>{
    console.log('heyyy')
    const response=await authAxiosInstance.post<IAxiosResponse>(
        "/signup",
        user
    )
    return response.data
}
export const logout =async()=>{
    await authAxiosInstance.post('/logout')
}
export const login =async (user:ILoginData):Promise<IAxiosResponse>=>{
    const response =await authAxiosInstance.post<IAxiosResponse>(
        "/login",
        user
    )
    return response.data
}

export const addProduct =async(product:IProductData):Promise<IAddProductResponse>=>{
    console.log('broooh')
    const response =await authAxiosInstance.post<IAddProductResponse>(
        "/add-product",
        product
    )
    return  response.data;

}
export const getMyProducts =async(params:{page:number,limit:number;search?:string}):Promise<IGetMyProductsResponse>=>{
    const response =await authAxiosInstance.get<IGetMyProductsResponse>(
        "get-products",
        {params}
    )
    return response.data;
}
export const getProductById =async(productId:string):Promise<IGetProductByIdResponse>=>{
    const response =await authAxiosInstance.get<IGetProductByIdResponse>(
        `get-product/${productId}`,
        
    )
    return response.data;
}
export const editProduct =async(productId:string,data:IProductData)=>{
    const response =await authAxiosInstance.put(
        `/edit-product/${productId}`,data

    );
    return response.data;
}

export const deleteProduct = async (productId: string) => {
  const response = await authAxiosInstance.delete(`/delete-product/${productId}`);
  return response.data;
};
export const addCustomer =async(customer:IGetCustomerData):Promise<IAddCustomersResponse>=>{
    console.log('addcusttttt')
    const response=await authAxiosInstance.post<IAddCustomersResponse>(
        "/add-customer",
        customer
    )
    return response.data;
}
export const getCustomers =async(params:{page:number,limit:number}):Promise<IGetCustomersResponse>=>{
    const response=await authAxiosInstance.get(
        "/get-customers",
        {params}
    )
    return response.data
}

export const salesReport = async (type: "daily" | "weekly" | "monthly") => {
  const response = await authAxiosInstance.get("/sales-report", {
    params: { type },
  });
  return response.data; 
};

export const itemReport =async ():Promise<ITemReportResponse>=>{
    const response =await authAxiosInstance.get("/item-report")
    return response.data;
}
