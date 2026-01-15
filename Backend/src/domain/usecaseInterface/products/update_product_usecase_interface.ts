import { IProductEntity } from "../../entity/product_entity";

export interface IUpdateProductUseCase{
    execute(
        productId:string,
        userId:string,
        data:Partial<IProductEntity>
    ):Promise<IProductEntity>
}