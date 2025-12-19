import { Request, Response, NextFunction } from "express";
import { AppError } from "../../application/error/AppError";
import { HttpStatusCode } from "../../utils/httpStatusCode";
import { ErrorCode } from "../../application/error/ErrorCode";

export const errorHandler=(err:Error,_req:Request,res:Response,_next:NextFunction)=>{
    if(err instanceof AppError){
        return res.status(err.status).json({
            success:false,
            errorCode:err.code,
            message:err.message
        })
    }
    console.log('Unexpected Error : ',err)

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success:false,
        errorCode:ErrorCode.INTERNAL_ERROR,
        message:"Something went wrong"
    })
}