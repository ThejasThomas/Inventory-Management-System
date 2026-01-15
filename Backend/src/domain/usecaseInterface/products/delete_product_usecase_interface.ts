export interface IDeleteProductUseCase {
    execute(productId:string,userId:string):Promise<void>
}