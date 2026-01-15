import { ICustomerEntity } from "../../entity/customer_entity";

export interface IAddCustomerUseCase {
    execute(data:ICustomerEntity):Promise<ICustomerEntity>
}