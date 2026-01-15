import { inject, injectable } from "tsyringe";
import { ICustomerRepository } from "../../../domain/repositoryInterface/customers/customer_repository_interface";
import { IGetItemReportUseCase } from "../../../domain/usecaseInterface/customers/get_item_report_usecse_interface";
import { IItemReportEntity } from "../../../domain/entity/ItemReportEntity";

@injectable()
export class GetItemReportUseCase implements IGetItemReportUseCase {
  constructor(
    @inject("ICustomerRepository")
    private _customerRepo: ICustomerRepository
  ) {}
  async execute(userId: string): Promise<IItemReportEntity[]> {
      console.log('heyyyy')

    return this._customerRepo.getItemReportByUser(userId);
  }
}
