import { inject, injectable } from "tsyringe";
import type { IRegisterUserUseCase } from "../../../domain/usecaseInterface/auth/register_user_usecase_interface";
import type { IUserEntity } from "../../../domain/entity/user_entity";
import type { IUserRepository } from "../../../domain/repositoryInterface/users/user_repository_interface";
import type { IUserExistenceService } from "../../../domain/serviceInterface/user_existence_service_interface";
import { CustomError } from "../../../domain/utils/custom_error";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";
import type { IBcrypt } from "../../../presentation/security/bcrypt_interface";
import { generateUniqueId } from "../../../shared/utils/unique_uuid_helper";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    @inject("IUserRepository")
    private _userRepo: IUserRepository,
    @inject("IUserExistenceService")
    private _useExistenceService: IUserExistenceService,
    @inject("IBcrypt")
    private _passwordBcrypt: IBcrypt
  ) {}
  async execute(user: IUserEntity): Promise<IUserEntity> {
    const { email, password } = user;
    console.log('email',email)
    const isEmailExisting = await this._useExistenceService.emailExists(email);
    if (isEmailExisting) {
      throw new CustomError(ERROR_MESSAGE.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
    }
    const hashedPassword = password
      ? await this._passwordBcrypt.hash(password)
      : null;

    const userId = generateUniqueId();
    return await this._userRepo.save({
      ...user,
      password: hashedPassword ?? "",
      userId,
    });
  }
}
