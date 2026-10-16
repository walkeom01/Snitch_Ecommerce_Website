import {Router} from "express"
import { createProductValidator } from "../validators/product.validator.js"
import { authenticate } from "../middlewares/auth.middle.js"
import { createProduct } from "../controller/product.controller.js"


const router = Router()

router.post("/",authenticate,(req,res,next)=>{
    //inline mmiddlewaare
    //user get from authenticate middleware
    if(req.user.role !== "seller"){
        return res.status(403).json({
            message:"forbidden request"
        })
    }

    next()
},createProduct)

export default router