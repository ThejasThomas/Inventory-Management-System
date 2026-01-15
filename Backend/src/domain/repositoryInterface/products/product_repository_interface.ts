import { IProductEntity } from "../../entity/product_entity";

export interface IProductRepository{
    createProduct(product:IProductEntity):Promise<IProductEntity>;
    findByUserId(userId:string,page:number,limit:number,search:string):Promise<{products:IProductEntity[];total:number}>
    getById(productId:string,userId:string):Promise<IProductEntity | null>
    updateProduct(productId:string,userId:string,updateData:Partial<IProductEntity>):Promise<IProductEntity|null>
    deleteById(productId:string,userId:string):Promise<boolean>
}