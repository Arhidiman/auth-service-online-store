const crypto = require('crypto')
import fs from "fs";
const jwt = require('jsonwebtoken')
import type {Request, Response} from "express";
import {usersModel} from "../models/UsersModel.ts"
import {jwtConfig} from '../jwtConfig.ts'

const hash = (s: string) => {
    return crypto.createHash('sha256').update(s).digest('hex')
}

const generateTokenPair = (data: {username: string}) => {
    const accessToken = jwt.sign(
        data,
        jwtConfig.atSecret,
        { expiresIn: jwtConfig.atLife }
    )
    const refreshToken = jwt.sign(
        { atTokenHash: hash(accessToken) },
        jwtConfig.rtSecret,
        { expiresIn: jwtConfig.rtLife }
    )
    const tokensData = JSON.parse(fs.readFileSync(__dirname+'/tokensData.json').toString())
    tokensData[refreshToken] = {
        accessToken,
        data
    }
    fs.writeFileSync('tokensData.json', JSON.stringify(tokensData))
    return {
        accessToken,
        refreshToken
    }
}

export class AuthController {

    async register(req: Request, res: Response) {
        try {
            const {username, password} = req.body
            const { accessToken, refreshToken } = generateTokenPair({username})

            const userData = await usersModel.createUser(username, password, accessToken)
            // const userData = await usersModel.getUser(username, password, accessToken)


            console.log(userData, 'user data from auth service')

            res.status(201).send(userData)
        } catch (err: any) {
            res.status(err.data.code).send(`Ошибка создания пользователя. ${err.message}`)
            console.log(`Ошибка регистрации пользователя на сервисе аутентификации ${err.message}`)
        }
    }

    async authenticate(req: Request, res: Response) {
        try {
            const {username, password} = req.body
            const { accessToken, refreshToken } = generateTokenPair({username})
            const userData = await usersModel.getUser(username, password)

            if (userData && username === userData.username) {
                console.log(userData, 'user data from database service')
                res.status(201).send(userData)
                console.log(accessToken, 'accessToken')
            } else {
                res.status(401).json('Неверный логин или пароль')
            }

        } catch (err: any) {

            console.log(err, 'AUTH ERROR')
            res.status(500).send(`Ошибка аутентификации пользователя. ${err.message}`)
        }
    }
}