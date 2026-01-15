import { inject, injectable } from "tsyringe";
import { ILoginUserUseCase } from "../../../domain/usecaseInterface/auth/login_user_usecase_interface";
import { IUserRepository } from "../../../domain/repositoryInterface/users/user_repository_interface";
import { IUserEntity } from "../../../domain/entity/user_entity";
import { LoginUserDTO } from "../../dto/login_user_dto";
import { email } from "zod";
import { CustomError } from "../../../domain/utils/custom_error";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";
import { IBcrypt } from "../../../presentation/security/bcrypt_interface";

@injectable()
export class LoginUserUseCase implements ILoginUserUseCase{
    constructor(
        @inject("IUserRepository")
        private _userRepo:IUserRepository,
        @inject("IBcrypt")
        private _passwordBcrypt:IBcrypt
    ){}
    async execute(user: LoginUserDTO): Promise<IUserEntity> {
        const userData=await this._userRepo.findOne({email:user.email});
        if(!userData){
            throw new CustomError(
                ERROR_MESSAGE.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        if(user.password){
            const isPasswordMatch =await this._passwordBcrypt.compare(
                user.password,
                userData.password
            )
            if(!isPasswordMatch){
                throw new CustomError(
                    ERROR_MESSAGE.INVALID_CREDENTIALS,
                    HTTP_STATUS.FORBIDDEN
                )
            }
        }
        return userData;
    }
}