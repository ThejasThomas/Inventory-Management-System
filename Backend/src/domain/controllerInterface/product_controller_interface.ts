import { Request, Response } from "express";

export interface IProductController {
    addProduct(req:Request,res:Response):Promise<void>
    getMyProducts(req:Request,res:Response):Promise<void>
    getProductById(req:Request,res:Response):Promise<void>
    updateProduct(req:Request,res:Response):Promise<void>
    deleteProduct(req:Request,res:Response):Promise<void>
}