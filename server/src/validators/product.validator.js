import {body , validationResult} from "express-validator"


export const createProductValidator = [
    body("title")
        .exists().withMessage("title required").bail()
        .isString().withMessage("title shoulb be string").bail()
        .trim()
        .isLength({min:2 , max:100}).withMessage("title lenth btwn 2 to 100").bail()
        .isAlpha("en-US",{ignore:" "}).withMessage("title can only have "),//

    body("description")
        .exists().withMessage("des required")
        .isString().withMessage("des must be string")
        .trim()
        .isLength({min:20 , max:500}).withMessage("des between 20 to 500"),
    
    body("price.amount")
        .exists().withMessage("price required")
        .isFloat({min:0}).withMessage("price must be floating number"),
    
    body("price.currency")
        .exists().withMessage("currency is required").bail()
        .isString().withMessage("currency must be sti=ring value")
        .isIn(["INR","USD"]).withMessage("currency cna be inr or usd"),

    body("sizes")
        .exists().withMessage("size is required ").bail()
        .isArray().withMessage("sizez must be array").bail(),

    body("sizez.*.size")
        .exists().withMessage("sizes must be present in every entry").bail()
        .isString().withMessage("size must be string value").bail()
        .trim()
        .isIn(["XS","S","M","L","XL","XXL"]).withMessage("size can only be xs s m l xl xxl"),
    
    body("sizes.*.stock")//checks all stocks at once
        .exists().withMessage("stock must be present in every entry of size array")
        .isInt({min:0}).withMessage("stock must be integer").bail(),

    (req,res,next)=>{
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                message:"invalid request",
                errors:errors.array()
            })
        }

        next()
    }    



]