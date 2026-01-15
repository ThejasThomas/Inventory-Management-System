import { LoginUserDTO } from "../../../application/dto/login_user_dto";
import { IUserEntity } from "../../entity/user_entity";

export interface ILoginUserUseCase{
    execute(user:LoginUserDTO):Promise<IUserEntity>
}