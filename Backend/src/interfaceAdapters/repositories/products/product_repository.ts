import { injectable } from "tsyringe";
import { IProductRepository } from "../../../domain/repositoryInterface/products/product_repository_interface";
import { IProductEntity } from "../../../domain/entity/product_entity";
import { ProductModel } from "../../database/schemas/product_schema";
import { Types } from "mongoose";


@injectable()
export class ProductRepository implements IProductRepository{
async createProduct(product: IProductEntity): Promise<IProductEntity> {
    console.log("repo reached",product)
    const created=await ProductModel.create(product);
    console.log('created',created)
    return {
        userId:created.userId.toString(),
        productId:created._id.toString(),
        name:created.name,
        description:created.description,
        quantity:created.quantity,
        price:created.price,
    }
}
async findByUserId(userId: string, page: number, limit: number,search:string): Promise<{ products: IProductEntity[]; total: number; }> {
    const skip =(page-1)*limit;
      const query: any = { userId };

    if (search) {
    query.name = { $regex: search, $options: "i" };
  }

    const [products,total]=await Promise.all([
        ProductModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({createdAt:-1}),

        ProductModel.countDocuments(query)
    ])
    return {
        total,
        products:products.map((product)=>({
            productId:product.id.toString(),
            userId:product.userId.toString(),
            name:product.name,
            description:product.description,
            quantity:product.quantity,
            price:product.price,
        }))
    }
}
async getById(productId: string, userId: string): Promise<IProductEntity | null> {
    const product=await ProductModel.findOne({
        _id:productId,
        userId,
    })
    if(!product){
        return null;
    }
    return {
    productId: product._id.toString(),
    userId: product.userId.toString(),
    name: product.name,
    description: product.description,
    quantity: product.quantity,
    price: product.price,
  };

}
async updateProduct(productId: string, userId: string, updateData: Partial<IProductEntity>): Promise<IProductEntity | null> {
    const updated =await ProductModel.findOneAndUpdate(
        {_id:productId,userId},
        {
            name:updateData.name,
            description:updateData.description,
            quantity:updateData.quantity,
            price:updateData.price
        },
        {new:true}
    );

    if(!updated)return null;

    return {
        productId:updated.id.toString(),
        userId:updated.userId?.toString(),
        name:updated.name,
        description:updated.description,
        quantity:updated.quantity,
        price:updated.price
    }
}
async deleteById(productId: string, userId: string): Promise<boolean> {
    const result =await ProductModel.deleteOne({
        _id:new Types.ObjectId(productId),
    });
    return result.deletedCount ===1;
}
}