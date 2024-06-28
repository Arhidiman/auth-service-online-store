import {Request, Response} from "express";
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
import {usersModel} from "../models/UsersModel.ts";

export class AuthController {

    async register(req: Request, res: Response) {
        const {name, password} = req.body

        res.status(200).send(`user ${name} registered successfully.`)

        await usersModel.createUser(name, password)

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
        await usersModel.createUser(name, password)

        res.status(201).send({message: `user ${name} authenticated successfully`})

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