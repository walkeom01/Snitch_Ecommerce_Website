import {body , validationResult} from "express-validator"


export const registerValidator = [

    body('email')
    .exists().withMessage("email is required").bail()
    .trim()
        .isEmail().withMessage("enter valid email id ") ,

    body('name')
    .exists().withMessage('name is required').bail()
    .isString().withMessage("name must be string ")
    .trim()
    .isLength({min:2 , max:50}).withMessage("name length between 2 to 50 letters"),


    body('password')
        .exists().withMessage('pass is required').bail()
        .isString().withMessage('pass must be string ')
        .trim()
        .isLength({min:6}).withMessage("pass must be minimum 6 charachters"),


        //middleware for response sending 
    (req,res,next) => {
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


export const loginValidator =[
    body("email")
        .exists().withMessage("email is required").bail()
        .isString().withMessage("email is not valid ").bail()
        .trim()
        .isEmail().withMessage("enter valid email id "),
    
    body("password")
        .exists().withMessage("password is required ")
        .isString().withMessage("pass must be string ")
        .trim()
        .isLength({min:6}).withMessage("pass min charachter is 6 "),

    (req,res,next)=>{
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                message:"invalid data",
                errors:errors.array()
            })
            }

        next()
    }
]
