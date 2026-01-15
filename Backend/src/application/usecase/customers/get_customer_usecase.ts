import { inject, injectable } from "tsyringe";
import { ICustomerRepository } from "../../../domain/repositoryInterface/customers/customer_repository_interface";
import { IGetCustomersByUserUseCase } from "../../../domain/usecaseInterface/customers/get_customers_usecase_interface";
import { ERROR_MESSAGE } from "../../../shared/constants";
import { CustomError } from "../../../domain/utils/custom_error";

@injectable()
export class GetCustomersByUserUseCase
  implements IGetCustomersByUserUseCase
{
  constructor(
    @inject("ICustomerRepository")
    private _customerRepository: ICustomerRepository
  ) {}

  async execute(userId: string, page: number, limit: number) {
    if (!userId) {
      throw new CustomError(ERROR_MESSAGE.UNAUTHORIZED_ACCESS, 401);
    }

    return await this._customerRepository.getCustomersByUser(
      userId,
      page,
      limit
    );
  }
}
