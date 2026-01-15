import { inject, injectable } from "tsyringe";
import { IUpdateProductUseCase } from "../../../domain/usecaseInterface/products/update_product_usecase_interface";
import { IProductRepository } from "../../../domain/repositoryInterface/products/product_repository_interface";
import { IProductEntity } from "../../../domain/entity/product_entity";
import { CustomError } from "../../../domain/utils/custom_error";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";

@injectable()

export class UpdateProductUsecase implements IUpdateProductUseCase{
    constructor(
        @inject("IProductRepository")
        private _productRepository:IProductRepository
    ){}

    async execute(productId: string, userId: string, data: Partial<IProductEntity>): Promise<IProductEntity> {
        const updated =await this._productRepository.updateProduct(
            productId,
            userId,
            data
        );

        if(!updated){
            throw new CustomError(
                ERROR_MESSAGE.PRODUCT_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        return updated;
    }
}