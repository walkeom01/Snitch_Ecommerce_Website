import {Router} from "express"
import {registerValidator,loginValidator} from "../validators/auth.validators.js"
import { register , login , refresh } from "../controller/aut.controller.js"


const router = Router()

//post for register api
router.post('/register',registerValidator,register )

//post for login api 
router.post("/login",loginValidator,login)

// post for refresh
router.post("/refresh",refresh)
export default router