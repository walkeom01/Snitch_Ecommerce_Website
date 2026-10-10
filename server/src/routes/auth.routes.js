import {Router} from "express"
import registerValidator from "../validators/auth.validators"



const router = Router()

//post for register api
router.post('/register',registerValidator, )



export default router