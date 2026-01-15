import { ISalesReportEntity } from "../../entity/sales_report_entity";

export interface IGetSalesReportUseCase {
  execute(
    userId: string,
    type: "daily" | "weekly" | "monthly"
  ): Promise<ISalesReportEntity[]>;
}
