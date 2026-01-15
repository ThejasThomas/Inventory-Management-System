import { ICustomerEntity } from "../../entity/customer_entity";

export interface IGetCustomersByUserUseCase {
  execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    customers: ICustomerEntity[];
    total: number;
  }>;
}
