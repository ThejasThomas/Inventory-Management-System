import { model, Schema } from "mongoose";
import { IUserEntity } from "../../../domain/entity/user_entity";

export const UserSchema =new Schema<IUserEntity>(
    {
        userId:{
            type:String,
            unique:true
        },
        fullName:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:String,
            required:true
        }
    }
)
export const UserModel =model<IUserEntity>("User",UserSchema);