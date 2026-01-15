import { inject, injectable } from "tsyringe";
import { IGetProductUseCase } from "../../../domain/usecaseInterface/products/get_product_usecase_interface";
import { IProductRepository } from "../../../domain/repositoryInterface/products/product_repository_interface";
import { IProductEntity } from "../../../domain/entity/product_entity";

@injectable()
export class GetProductUseCase implements IGetProductUseCase{
    constructor(
        @inject("IProductRepository")
        private _productRepo:IProductRepository
    ){}

    async execute(userId: string, page: number, limit: number): Promise<{ products: IProductEntity[]; total: number; }> {
        return this._productRepo.findByUserId(userId,page,limit)
    }
}
