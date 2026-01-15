import { inject, injectable } from "tsyringe";
import { IUserExistenceService } from "../../domain/serviceInterface/user_existence_service_interface";
import { IUserRepository } from "../../domain/repositoryInterface/users/user_repository_interface";

@injectable()
export class UserExistenceService implements IUserExistenceService{
    constructor(
        @inject("IUserRepository")
        private _userRepo:IUserRepository
    ){}
    async emailExists(email: string): Promise<boolean> {
        console.log('heyyloooo')
        const [user]=await Promise.all([
            this._userRepo.findOne({email})
        ])
        return Boolean(user)
    }
}