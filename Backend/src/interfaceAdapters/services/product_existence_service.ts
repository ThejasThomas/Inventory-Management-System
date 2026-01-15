import { inject, injectable } from "tsyringe";
import { IProductExistenceService } from "../../domain/serviceInterface/product_existence_service_interface";
import { IProductRepository } from "../../domain/repositoryInterface/products/product_repository_interface";

@injectable()
export class ProductExistenceService implements IProductExistenceService{
    constructor(
        @inject("IProductRepository")
        private _productRepo:IProductRepository
    ){}

    async nameExists(name: string): Promise<boolean> {
        console.log('oooo')
        const [product]=await Promise.all([
            this._productRepo.findOne({name})
        ])
        console.log('ggggg')
        return Boolean(product)
    }
}