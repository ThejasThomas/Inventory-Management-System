import { IUserEntity } from "../../entity/user_entity";

export interface IRegisterUserUseCase {
    execute(user:IUserEntity):Promise<IUserEntity>
}