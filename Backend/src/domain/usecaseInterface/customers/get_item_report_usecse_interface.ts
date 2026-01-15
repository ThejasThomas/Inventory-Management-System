import { IItemReportEntity } from "../../entity/ItemReportEntity";

export interface IGetItemReportUseCase {
  execute(userId: string): Promise<IItemReportEntity[]>;
}
