import { inject, injectable } from "tsyringe";
import { ICustomerRepository } from "../../../domain/repositoryInterface/customers/customer_repository_interface";
import { IGetSalesReportUseCase } from "../../../domain/usecaseInterface/customers/get_sales_report_usecase_interface";
import { ISalesReportEntity } from "../../../domain/entity/sales_report_entity";
import { CustomError } from "../../../domain/utils/custom_error";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class GetSalesReportUseCase implements IGetSalesReportUseCase {
  constructor(
    @inject("ICustomerRepository")
    private _customerRepository: ICustomerRepository
  ) {}

  async execute(
    userId: string,
    type: "daily" | "weekly" | "monthly"
  ): Promise<ISalesReportEntity[]> {
    if (!userId) {
      throw new CustomError(
        ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    console.log('usecaseee')

    return await this._customerRepository.getSalesReport(userId, type);
  }
}
