export interface IProductExistenceService{
    nameExists(name:string):Promise<boolean>
}