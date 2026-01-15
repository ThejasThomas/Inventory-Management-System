import { Request, Response } from "express";
import { BaseRoute } from "./base_route";
import { customerController, productController, userController } from "../di/resolver";
import { authMiddleware } from "../middleware/auth_middleware";
import { CustomerController } from "../controller/customer_controller";

export class AuthRoutes extends BaseRoute{
    constructor(){
        super()
    }

    protected initializeRoutes(): void {
        this.router.get('/refresh-session',authMiddleware,(req:Request,res:Response)=>{
            userController.refreshSession(req,res)
        })
        this.router.post('/signup',(req:Request,res:Response)=>{
            userController.register(req,res)
        })
        this.router.post('/login',(req:Request,res:Response)=>{
            userController.login(req,res)
        })
         this.router.post("/add-product",authMiddleware,(req:Request,res:Response)=>{
            productController.addProduct(req,res)
        })
        this.router.get("/get-products",authMiddleware,(req:Request,res:Response)=>{
            productController.getMyProducts(req,res)
        })
        this.router.get("/get-product/:id",authMiddleware,(req:Request,res:Response)=>{
            productController.getProductById(req,res)
        })
        this.router.put("/edit-product/:id",authMiddleware,(req:Request,res:Response)=>{
            productController.updateProduct(req,res)
        })
        this.router.delete("/delete-product/:id",authMiddleware,(req:Request,res:Response)=>{
            productController.deleteProduct(req,res)
        })
        this.router.post("/add-customer",authMiddleware,(req:Request,res:Response)=>{
            customerController.addCustomers(req,res)
        })
        this.router.get(
            "/get-customers",
            authMiddleware,
            (req:Request,res:Response)=>{
                customerController.getMyCustomer(req,res)
            }
        )
        this.router.get("/sales-report",authMiddleware,(req,res)=>{
            customerController.getSalesReport(req,res)
        })
        this.router.get("/item-report",authMiddleware,(req:Request,res:Response)=>{
            customerController.getItemReport(req,res)
        })
    }
}