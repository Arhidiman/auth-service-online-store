import {Router} from "express"
import {AuthController} from "../controllers/AuthController.ts";

export const AuthRouter: Router = Router()

const authController = new AuthController()

AuthRouter.post('/auth', authController.authenticate)
AuthRouter.get('/create', authController.register)