import { inject, injectable } from "tsyringe";
import { IGetProductByIdUseCase } from "../../../domain/usecaseInterface/products/get_product_by_id_usecase_interface";
import { IProductRepository } from "../../../domain/repositoryInterface/products/product_repository_interface";
import { IProductEntity } from "../../../domain/entity/product_entity";
import { CustomError } from "../../../domain/utils/custom_error";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";

@injectable()

export class GetProductByIdUseCase implements IGetProductByIdUseCase {
    constructor(
        @inject("IProductRepository")
        private _productRepo:IProductRepository
    ){}

    async execute(productId: string, userId: string): Promise<IProductEntity> {
        const product =await this._productRepo.getById(productId,userId)

        if(!product){
            throw new CustomError(ERROR_MESSAGE.PRODUCT_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }
        return product;
    }
}