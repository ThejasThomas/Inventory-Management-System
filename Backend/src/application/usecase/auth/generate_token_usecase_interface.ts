import { inject, injectable } from "tsyringe";
import { IGenerateTokenUseCase } from "../../../domain/usecaseInterface/auth/generate_token_usecase_interface";
import { ITokenService } from "../../../domain/serviceInterface/token_service_interface";

@injectable()

export class GenerateTokenUseCase implements IGenerateTokenUseCase{
    constructor(
        @inject("ITokenService")
        private _tokenService:ITokenService
    ){}

    async execute(userId: string, email: string): Promise<{ accessToken: string; refreshToken: string; }> {
        const payload ={email,userId}
        const accessToken=this._tokenService.generateAccessToken(payload)
        const refreshToken=this._tokenService.generateRefreshToken(payload);

        return {
            accessToken,
            refreshToken
        }
    }
}