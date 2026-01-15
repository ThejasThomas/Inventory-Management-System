import { container } from "tsyringe";
import { IUserExistenceService } from "../../domain/serviceInterface/user_existence_service_interface";
import { UserExistenceService } from "../../interfaceAdapters/services/user_existence_service";
import { IBcrypt } from "../security/bcrypt_interface";
import { PasswordBcrypt } from "../security/password_bcrypt";
import { ITokenService } from "../../domain/serviceInterface/token_service_interface";
import { TokenService } from "../../interfaceAdapters/services/token_service";

export class ServiceRegistry{
    static registerServices():void{
        container.register<IUserExistenceService>("IUserExistenceService",{
            useClass:UserExistenceService
        })
        container.register<IBcrypt>("IBcrypt",{
            useClass:PasswordBcrypt
        })
        container.register<ITokenService>("ITokenService",{
            useClass:TokenService
        })
    }
    
}