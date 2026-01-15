import { Request, Response } from "express";

export interface IUserController{
    refreshSession(req:Request,res:Response):Promise<void>
    register(req:Request,res:Response):Promise<void>
    login(req:Request,res:Response):Promise<void>
    logout(req:Request,res:Response):Promise<void>
}