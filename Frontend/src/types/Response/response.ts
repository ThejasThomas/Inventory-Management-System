import type { ICustomerData, IGetCustomerData } from "../customer_type";
import type { IProductData } from "../product_types";
import type {  UserDTO } from "../user_types";

export interface IAxiosResponse {
  success: boolean;
  message: string;
  user:UserDTO
}

export interface IAddProductResponse {
  success: boolean;
  message: string;
  user:IProductData
}

export interface IGetMyProductsResponse{
  success:boolean,
  products:IProductData[]
  total:number
}
export interface IGetProductByIdResponse{
  success:boolean,
  product:IProductData
}
export interface IAddCustomersResponse{
  success:boolean;
  message:string;
  customer:IGetCustomerData
}
export interface IGetCustomersResponse{
  success:boolean,
  customers:ICustomerData[]
  total:number
}