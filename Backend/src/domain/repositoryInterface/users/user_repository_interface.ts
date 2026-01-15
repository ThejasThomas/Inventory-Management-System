import { IUserEntity } from "../../entity/user_entity";
import { IBaseRepository } from "../base_repository_interface";

export interface IUserRepository extends IBaseRepository<IUserEntity>{
    
}