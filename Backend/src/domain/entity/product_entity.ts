export interface IProductEntity{
    productId?:string;
    userId:string;
    name:string;
    description:string;
    quantity:number;
    price:number;
    createdAt?:Date;
    updatedAt?:Date;
}