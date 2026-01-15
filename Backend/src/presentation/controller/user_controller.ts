import { inject, injectable } from "tsyringe";
import { IUserController } from "../../domain/controllerInterface/user_controller";
import type { IRegisterUserUseCase } from "../../domain/usecaseInterface/auth/register_user_usecase_interface";
import { UserSchemaValidation } from "../../shared/validation/user_signup_validation";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../shared/constants";
import { CustomError } from "../../domain/utils/custom_error";
import { Request, Response } from "express";
import { LoginUserDTO } from "../../application/dto/login_user_dto";
import { loginSchema } from "../../shared/validation/user_login_validation";
import { success } from "zod";
import { ILoginUserUseCase } from "../../domain/usecaseInterface/auth/login_user_usecase_interface";
import { IGenerateTokenUseCase } from "../../domain/usecaseInterface/auth/generate_token_usecase_interface";
import { setAuthCookies } from "../../shared/utils/cookie_helper";
import { AuthRequest } from "../middleware/auth_middleware";
@injectable()
export class UserController implements IUserController {
  constructor(
    @inject("IRegisterUserUseCase")
    private _registerUserUseCase: IRegisterUserUseCase,
    @inject("ILoginUserUseCase")
    private _loginUSerUseCase: ILoginUserUseCase,
    @inject("IGenerateTokenUseCase")
    private _generateTokenUseCase: IGenerateTokenUseCase
  ) {}

  async refreshSession(req: Request, res: Response): Promise<void> {
    try{
          const authReq = req as AuthRequest;
if (!authReq.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGE.INVALID_TOKEN,
      });
      return;
    }
      const {userId,email}=authReq.user;

      if(!userId){
        res.status(401).json({
          success:false,
          message:ERROR_MESSAGE.INVALID_TOKEN
        })
        return;
      }
      res.status(200).json({
        success:true,
        user:{
          userId,
          email
        }
      })
    }catch(error){
      console.log(error)
      res.status(500).json({
        success:false,
        message:ERROR_MESSAGE.INTERNEL_SERVER_ERROR
      })
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedSchema = UserSchemaValidation.parse(req.body);

      await this._registerUserUseCase.execute(validatedSchema);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGE.REGISTRATION_SUCCESS,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGE.REGISTRATION_NOT_COMPLETE,
      });
    }
  }
  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log('heyyy')
      const data = req.body as LoginUserDTO;
      const validatedData = loginSchema.parse(data);
      if (!validatedData) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.INVALID_CREDENTIALS,
        });
        return;
      }
      const user = await this._loginUSerUseCase.execute(validatedData);

      if (!user.userId || !user.email) {
        throw new CustomError(
          ERROR_MESSAGE.MISSING_DATAS,
          HTTP_STATUS.BAD_REQUEST
        );
      }
      const tokens = await this._generateTokenUseCase.execute(
        user.userId as string,
        user.email
      );

      const accessTokenName = `access_token`;
      const refreshTokenName = `refresh_token`;

      setAuthCookies(
        res,
        tokens.accessToken,
        tokens.refreshToken,
        accessTokenName,
        refreshTokenName
      );

      const { password, ...userWithoutPassword } = user;
      console.log(password);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGE.LOGIN_SUCCESS,
        user: userWithoutPassword,
      });
    } catch (err) {
      console.log(err)
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
        return;
      }
    }
  }
}
