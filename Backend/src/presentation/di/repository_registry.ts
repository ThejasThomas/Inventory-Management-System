import { container } from "tsyringe";
import { UserRepository } from "../../interfaceAdapters/repositories/users/user_repository";
import { ProductRepository } from "../../interfaceAdapters/repositories/products/product_repository";
import { CustomerRepository } from "../../interfaceAdapters/repositories/customers/customer_repository";

export class RepositoryRegistry{
    static registerRepositories():void{
        container.register("IUserRepository",{
            useClass:UserRepository
        })
        container.register("IProductRepository",{
            useClass:ProductRepository
        })
        container.register("ICustomerRepository",{
            useClass:CustomerRepository
        })
    }
}