import {Router} from "express"
import {registerValidator,loginValidator} from "../validators/auth.validators.js"
import { register , login , refresh , getMe} from "../controller/aut.controller.js"
import { authenticate } from "../middlewares/auth.middle.js"

const router = Router()

//post for register api
router.post('/register',registerValidator,register )

//post for login api 
router.post("/login",loginValidator,login)

// post for refresh
router.post("/refresh",refresh)

//->/api/auth/me
//note jo bhi request /me pe ayegi voh pehle authencticate par jayegi then getMe pe ayegi 
router.get("/me",authenticate , getMe)
export default router