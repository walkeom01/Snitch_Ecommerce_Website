import {Router} from "express"
import {registerValidator} from "../validators/auth.validators.js"
import { register } from "../controller/aut.controller.js"


const router = Router()

//post for register api
router.post('/register',registerValidator,register )



export default router