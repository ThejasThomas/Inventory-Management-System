import { Request, Response } from "express";

export interface ICustomerController{
    addCustomers(req:Request,res:Response):Promise<void>
    getMyCustomer(req:Request,res:Response):Promise<void>
    getSalesReport(req:Request,res:Response):Promise<void>
    getItemReport(req:Request,res:Response):Promise<void>
}