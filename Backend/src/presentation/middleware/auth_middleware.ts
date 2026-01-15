import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { TokenService } from "../../interfaceAdapters/services/token_service";
import type { JwtPayload } from "jsonwebtoken";

const tokenService = new TokenService();

export interface AuthRequest extends Request {
  user?: JwtPayload & {
    userId: string;
    email: string;
  };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies?.access_token;

    if (!accessToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGE.UNAUTHORIZED_ACCESS
      });
    }

    const decoded = tokenService.verifyAccessToken(accessToken);

    if (!decoded || typeof decoded === "string") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGE.INVALID_TOKEN,
      });
    }

    (req as AuthRequest).user = decoded as JwtPayload & {
      userId: string;
      email: string;
    };

    next();
  } catch (error: any) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGE.TOKEN_EXPIRED,
    });
  }
};
