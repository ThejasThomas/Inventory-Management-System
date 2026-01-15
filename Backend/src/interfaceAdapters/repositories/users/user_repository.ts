import { injectable } from "tsyringe";
import { IUserEntity } from "../../../domain/entity/user_entity";
import { IUserRepository } from "../../../domain/repositoryInterface/users/user_repository_interface";
import { UserModel } from "../../database/schemas/user_schema";
import { BaseRepository } from "../base_repository";

@injectable()

export class UserRepository extends BaseRepository<IUserEntity> implements IUserRepository{
    constructor(){
        super(UserModel)
    }

}