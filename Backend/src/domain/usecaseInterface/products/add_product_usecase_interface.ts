import { IProductEntity } from "../../entity/product_entity";

export interface IAddProductUseCase {
    execute(product:IProductEntity):Promise<IProductEntity>
}