import cookieParser from "cookie-parser";
import { Application } from "express";
import  express from "express"
import { config } from "../../shared/config";
import cors from "cors";
import { AuthRoutes } from "../routes/user_route";


export class ExpressServer{
    private _app:Application


    constructor(){
        this._app =express()
        this.configureMiddlewares()
        this.configureRoutes()
    }


    private configureMiddlewares():void{
        this._app.use(
            cors({
                origin:config.cors.ALLOWED_ORIGIN,
                methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
                credentials:true
            })
        )
        
        this._app.use(express.json())
        this._app.use(express.urlencoded({extended:true}));
        this._app.use(cookieParser())
    }

    private configureRoutes():void{
        this._app.use("/auth", new AuthRoutes().router)
    }
    public getApp():Application{
        return this._app
    }
}