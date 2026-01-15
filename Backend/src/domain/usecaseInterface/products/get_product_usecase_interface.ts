import { IProductEntity } from "../../entity/product_entity";

export interface IGetProductUseCase{
    execute(userId:string,page:number,limit:number):Promise<{products:IProductEntity[];total:number}>
}