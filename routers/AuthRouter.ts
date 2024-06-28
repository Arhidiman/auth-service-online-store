import {Router} from "express"
import {AuthController} from "../controllers/AuthController.ts";

export const AuthRouter: Router = Router()

const authController = new AuthController()

AuthRouter.get('/auth', authController.authenticate)
AuthRouter.post('/create', authController.register)