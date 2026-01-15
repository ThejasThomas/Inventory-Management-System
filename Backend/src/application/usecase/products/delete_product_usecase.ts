import { inject, injectable } from "tsyringe";
import { IDeleteProductUseCase } from "../../../domain/usecaseInterface/products/delete_product_usecase_interface";
import { IProductRepository } from "../../../domain/repositoryInterface/products/product_repository_interface";
import { CustomError } from "../../../domain/utils/custom_error";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";

@injectable()

export class DeleteProductUseCase implements IDeleteProductUseCase{
    constructor(
        @inject("IProductRepository")
        private _productRepository:IProductRepository
    ){}

    async execute(productId: string, userId: string): Promise<void> {
        const deleted =await this._productRepository.deleteById(productId,userId);

        if(!deleted){
            throw new CustomError(
                ERROR_MESSAGE.PRODUCT_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
    }
}