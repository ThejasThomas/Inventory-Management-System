import { inject, injectable } from "tsyringe";
import { IAddProductUseCase } from "../../../domain/usecaseInterface/products/add_product_usecase_interface";
import { IProductRepository } from "../../../domain/repositoryInterface/products/product_repository_interface";
import { IProductEntity } from "../../../domain/entity/product_entity";
import { CustomError } from "../../../domain/utils/custom_error";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";
import { IProductExistenceService } from "../../../domain/serviceInterface/product_existence_service_interface";
@injectable()
export class AddProductUseCase implements IAddProductUseCase{
    constructor(
        @inject("IProductRepository")
        private _productRepo:IProductRepository,
        @inject("IProductExistenceService")
        private _useExistenseService:IProductExistenceService
    ){}

    async execute(product: IProductEntity): Promise<IProductEntity> {
        console.log('broo')
        const isProductExisting =await this._useExistenseService.nameExists(product.name)
        if(isProductExisting){
            throw new CustomError(
                ERROR_MESSAGE.PRODUCT_ALREADY_EXISTS,
                HTTP_STATUS.CONFLICT
            )
        }
        console.log('heyyyy')
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