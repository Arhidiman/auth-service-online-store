const crypto = require('crypto')
import fs from "fs";

const jwt = require('jsonwebtoken')
import type {Request, Response} from "express";

import {usersModel} from "../models/UsersModel.ts"
import {jwtConfig} from '../jwtConfig.ts'

const hash = (s: string) => {
    return crypto.createHash('sha256').update(s).digest('hex')
}

const generateTokenPair = (data: {name: string}) => {
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
        const {name, password} = req.body
        const { accessToken, refreshToken } = generateTokenPair({name})

        await usersModel.createUser(name, password, accessToken)

        res.status(201).send({message: `user ${name} created successfully`})


        console.log(accessToken, 'accessToken')
        console.log(refreshToken, 'refreshToken')

        // const existedUser = parsedUsers.find((user)=>user.name === newUser.name)
        // if(!existedUser) {
        //     parsedUsers.push(newUser)
        //     const newData = JSON.stringify(parsedUsers)
        //     fs.writeFileSync('usersData.json', newData)
        //     res.status = 200
        //     res.send({
        //         name: newUser.name,
        //         password: newUser.password,
        //         message: 'Новый пользователь зарегистрирован'
        //     })
        // } else {
        //     res.status = 200
        //     res.send({
        //         message: 'Пользователь с таким именем уже существует'
        //     })
        // }
    }

    async authenticate(req: Request, res: Response) {
        const {name, password} = req.body
        const { accessToken, refreshToken } = generateTokenPair({name})

        const userData = await usersModel.getUser(name, password, accessToken)

        console.log(userData, 'user data')

        res.status(201).send({message: `user ${name} authenticated successfully`})


        console.log(accessToken, 'accessToken')
        console.log(refreshToken, 'refreshToken')

        // const existedUser = parsedUsers.find((user)=>
        //     user.name === authUser.name
        // )
        // if(existedUser) {
        //     if (existedUser.password !== authUser.password) {
        //         res.status = 200
        //         res.send({
        //             message: 'Ошибка - неверный пароль'
        //         })        }
        //     if (existedUser.password === authUser.password) {
        //         const { accessToken, refreshToken } = generateTokenPair({name: existedUser.name})
        //         res.status = 200
        //         res.send({
        //             message: "Успешно",
        //             accessToken,
        //             refreshToken
        //         })
        //     }
        // } else {
        //     res.send({
        //         message: 'Ошибка: неверный логин или пароль'
        //     })
        // }
    }
}