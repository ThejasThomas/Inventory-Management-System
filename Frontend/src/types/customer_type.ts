export interface ICustomerData{
    customerId?:string;
    userId?:string;
    customerName:string;
    address:string;
    mobileNumber:string;

    productName:string;
    quantity:number;
    createdAt:string,
}

export interface IGetCustomerData {
    customerId?:string;
    userId?:string;
    customerName:string;
    address:string;
    mobileNumber:string;

    productName:string;
    quantity:number;
}