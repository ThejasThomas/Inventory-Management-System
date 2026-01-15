export interface IUserEntity{
    userId?:string;
    fullName:string;
    email:string;
    phoneNumber:string;
    password:string;
    createdAt?:Date;
    updatedAt?:Date;
}