import { ICustomerEntity } from "../../entity/customer_entity";
import { IItemReportEntity } from "../../entity/ItemReportEntity";
import { ISalesReportEntity } from "../../entity/sales_report_entity";

export interface ICustomerRepository {
  addCustomer(data: ICustomerEntity): Promise<ICustomerEntity>;
  getCustomersByUser(userId: string, page: number, limit: number): Promise<{
    customers: ICustomerEntity[];
    total: number;
  }>;
  getSalesReport(userId:string,type:"daily"|"weekly"|"monthly"):Promise<ISalesReportEntity[]>
  getItemReportByUser(userId: string): Promise<IItemReportEntity[]>;

}
