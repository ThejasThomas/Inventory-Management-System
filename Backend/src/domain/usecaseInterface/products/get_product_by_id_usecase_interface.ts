import { IProductEntity } from "../../entity/product_entity";

export interface IGetProductByIdUseCase {
    execute(
        productId:string,
        userId:string
    ):Promise<IProductEntity>
}