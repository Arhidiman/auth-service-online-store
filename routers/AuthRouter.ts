import {Router} from "express"
import {AuthController} from "../controllers/AuthController.ts";

export const AuthRouter: Router = Router()

const authController = new AuthController()

AuthRouter.post('/user/sign-up', authController.register)
AuthRouter.post('/user/sign-in', authController.authenticate)
