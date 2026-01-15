import { model, Schema, Types } from "mongoose";

const productSchema =new Schema(
    {
        userId:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        }
    }
)

export const ProductModel =model("Product",productSchema)