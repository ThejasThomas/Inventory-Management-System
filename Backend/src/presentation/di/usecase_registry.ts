import { container } from "tsyringe";
import { IRegisterUserUseCase } from "../../domain/usecaseInterface/auth/register_user_usecase_interface";
import { RegisterUserUseCase } from "../../application/usecase/auth/register_user_usecase";
import { ILoginUserUseCase } from "../../domain/usecaseInterface/auth/login_user_usecase_interface";
import { LoginUserUseCase } from "../../application/usecase/auth/login_user_usecase";
import { IGenerateTokenUseCase } from "../../domain/usecaseInterface/auth/generate_token_usecase_interface";
import { GenerateTokenUseCase } from "../../application/usecase/auth/generate_token_usecase_interface";
import { IAddProductUseCase } from "../../domain/usecaseInterface/products/add_product_usecase_interface";
import { AddProductUseCase } from "../../application/usecase/products/add_product_usecase";
import { IGetProductUseCase } from "../../domain/usecaseInterface/products/get_product_usecase_interface";
import { GetProductUseCase } from "../../application/usecase/products/get_product_usecase";
import { IGetProductByIdUseCase } from "../../domain/usecaseInterface/products/get_product_by_id_usecase_interface";
import { GetProductByIdUseCase } from "../../application/usecase/products/get_product_by_id_usecase";
import { IUpdateProductUseCase } from "../../domain/usecaseInterface/products/update_product_usecase_interface";
import { UpdateProductUsecase } from "../../application/usecase/products/update_product_usecase";
import { IDeleteProductUseCase } from "../../domain/usecaseInterface/products/delete_product_usecase_interface";
import { DeleteProductUseCase } from "../../application/usecase/products/delete_product_usecase";
import { IAddCustomerUseCase } from "../../domain/usecaseInterface/customers/add_customer_usecase_interface";
import { AddCustomerUseCase } from "../../application/usecase/customers/add_customers_usecase";
import { IGetCustomersByUserUseCase } from "../../domain/usecaseInterface/customers/get_customers_usecase_interface";
import { GetCustomersByUserUseCase } from "../../application/usecase/customers/get_customer_usecase";
import { IGetSalesReportUseCase } from "../../domain/usecaseInterface/customers/get_sales_report_usecase_interface";
import { GetSalesReportUseCase } from "../../application/usecase/customers/get_sales_report_usecase";
import { IGetItemReportUseCase } from "../../domain/usecaseInterface/customers/get_item_report_usecse_interface";
import { GetItemReportUseCase } from "../../application/usecase/customers/get_item_report_usecase";
export class UseCaseRegistry{
    static registerUseCases():void{
        container.register<IRegisterUserUseCase>("IRegisterUserUseCase",{
            useClass:RegisterUserUseCase
        })
        container.register<ILoginUserUseCase>("ILoginUserUseCase",{
            useClass:LoginUserUseCase
        })
        container.register<IGenerateTokenUseCase>("IGenerateTokenUseCase",{
            useClass:GenerateTokenUseCase
        })
        container.register<IAddProductUseCase>("IAddProductUseCase",{
            useClass:AddProductUseCase
        })
        container.register<IGetProductUseCase>("IGetProductUseCase",{
            useClass:GetProductUseCase
        })
        container.register<IGetProductByIdUseCase>("IGetProductByIdUseCase",{
            useClass:GetProductByIdUseCase
        })
        container.register<IUpdateProductUseCase>("IUpdateProductUseCase",{
            useClass:UpdateProductUsecase
        })
        container.register<IDeleteProductUseCase>("IDeleteProductUseCase",{
            useClass:DeleteProductUseCase
        })
        container.register<IAddCustomerUseCase>("IAddCustomerUseCase",{
            useClass:AddCustomerUseCase
        })
        container.register<IGetCustomersByUserUseCase>("IGetCustomersByUserUseCase",{
            useClass:GetCustomersByUserUseCase
        })
        container.register<IGetSalesReportUseCase>("IGetSalesReportUseCase",{
            useClass:GetSalesReportUseCase
        })
        container.register<IGetItemReportUseCase>("IGetItemReportUseCase",{
            useClass:GetItemReportUseCase
        })
    }
}