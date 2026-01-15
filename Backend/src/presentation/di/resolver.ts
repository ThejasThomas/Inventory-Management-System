import { container } from "tsyringe";
import { IUserController } from "../../domain/controllerInterface/user_controller";
import { UserController } from "../controller/user_controller";
import { DependencyInjection } from "./index";
import { IProductController } from "../../domain/controllerInterface/product_controller_interface";
import { ProductController } from "../controller/product_controller";
import { CustomerController } from "../controller/customer_controller";
import { ICustomerController } from "../../domain/controllerInterface/customer_controller_interface";

DependencyInjection.registerAll()
export const userController =container.resolve<IUserController>(UserController)
export const productController=container.resolve<IProductController>(ProductController)
export const customerController=container.resolve<ICustomerController>(CustomerController)