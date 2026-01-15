import { inject, injectable } from "tsyringe";
import { ICustomerEntity } from "../../../domain/entity/customer_entity";
import { IAddCustomerUseCase } from "../../../domain/usecaseInterface/customers/add_customer_usecase_interface";
import { ICustomerRepository } from "../../../domain/repositoryInterface/customers/customer_repository_interface";

@injectable()
export class AddCustomerUseCase implements IAddCustomerUseCase {
  constructor(
    @inject("ICustomerRepository")
    private _customerRepo: ICustomerRepository
  ) {}

  async execute(data: ICustomerEntity): Promise<ICustomerEntity> {
    console.log('brrooh')
    return this._customerRepo.addCustomer(data);
  }
}
