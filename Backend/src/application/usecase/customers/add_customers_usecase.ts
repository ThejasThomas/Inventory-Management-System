import { inject, injectable } from "tsyringe";
import { ICustomerEntity } from "../../../domain/entity/customer_entity";
import { IAddCustomerUseCase } from "../../../domain/usecaseInterface/customers/add_customer_usecase_interface";
import { ICustomerRepository } from "../../../domain/repositoryInterface/customers/customer_repository_interface";
import { IProductRepository } from "../../../domain/repositoryInterface/products/product_repository_interface";
import { CustomError } from "../../../domain/utils/custom_error";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class AddCustomerUseCase implements IAddCustomerUseCase {
  constructor(
    @inject("ICustomerRepository")
    private _customerRepo: ICustomerRepository,
    @inject("IProductRepository")
    private _productRepo:IProductRepository
  ) {}

  async execute(data: ICustomerEntity): Promise<ICustomerEntity> {

    const product =await this._productRepo.findByName(data.productName)
    if(!product){
      throw new CustomError(
        ERROR_MESSAGE.PRODUCT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      )
      
    }
    if (product.quantity < data.quantity) {
    throw new Error("Not enough stock available!");
  }
  const newQty = product.quantity - data.quantity;
   await this._productRepo.updateQuantity(product.name, newQty);
    console.log('brrooh')
    return this._customerRepo.addCustomer(data);
  }
}
