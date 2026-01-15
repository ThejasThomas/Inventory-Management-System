// import { Request, Response } from "express";
// import { authMiddleware } from "../middleware/auth_middleware";
// import { BaseRoute } from "./base_route";
// import { ProductController } from "../controller/product_controller";
// import { productController } from "../di/resolver";

// export class AuthRoutes extends BaseRoute{
//     constructor(){
//         super()
//     }

//     protected initializeRoutes(): void {
//         this.router.post("/add-product",authMiddleware,(req:Request,res:Response)=>{
//             productController.addProduct(req,res)
//         })
//     }
// }