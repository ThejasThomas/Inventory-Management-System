import { IProductEntity } from "../../entity/product_entity";
import { IBaseRepository } from "../base_repository_interface";

export interface IProductRepository extends IBaseRepository<IProductEntity>{
    createProduct(product:IProductEntity):Promise<IProductEntity>;
    findByUserId(userId:string,page:number,limit:number,search:string):Promise<{products:IProductEntity[];total:number}>
    getById(productId:string,userId:string):Promise<IProductEntity | null>
    updateProduct(productId:string,userId:string,updateData:Partial<IProductEntity>):Promise<IProductEntity|null>
    deleteById(productId:string,userId:string):Promise<boolean>
    findByName(name: string): Promise<IProductEntity | null>;
  updateQuantity(id: string, qty: number): Promise<void>;
}