import { inject, injectable } from "tsyringe";
import { IAddProductUseCase } from "../../../domain/usecaseInterface/products/add_product_usecase_interface";
import { IProductRepository } from "../../../domain/repositoryInterface/products/product_repository_interface";
import { IProductEntity } from "../../../domain/entity/product_entity";
import { CustomError } from "../../../domain/utils/custom_error";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";
@injectable()
export class AddProductUseCase implements IAddProductUseCase{
    constructor(
        @inject("IProductRepository")
        private _productRepo:IProductRepository
    ){}

    async execute(product: IProductEntity): Promise<IProductEntity> {
        if(product.quantity < 0) throw new CustomError(
            ERROR_MESSAGE.QUANTITY_NOT_VALID,
            HTTP_STATUS.BAD_REQUEST
        )
        if(product.price < 0){
            throw new CustomError(
                ERROR_MESSAGE.PRICE_NOT_VALID,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        console.log('productttttt')

        return await this._productRepo.createProduct(product)

    }
}