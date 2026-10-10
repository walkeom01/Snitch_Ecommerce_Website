import {body , validationResult} from "express-validator"


const registerValidator = [

    body('email')
        .trim()
        .exists().withMessage("email is required")
        .isEmail().withMessage("enter valid email id ") ,

    body('name')
    .exists().withMessage('name is required')
    .isString().withMessage("name must be string ")
    .trim()
    .isLength({min:2 , max:50}).withMessage("name length between 2 to 50 letters"),


    body('password')
        .exists().withMessage('pass is required')
        .isString().withMessage('pass must be string ')
        .trim()
        .isLength({min:6}).withMessage("pass must be minimum 6 charachters"),

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

export default registerValidator