import {Request, Response} from "express";

const fs = require('fs')
const express = require('express')
const cors = require("cors")
// const crypto = require('crypto')
import * as crypto from 'crypto'; // Импортируем модуль crypto

const jwt = require('jsonwebtoken')
const config = require('./config')
const bodyParser = require("body-parser");
const app = express()
const originCors = true
const hash = (s: string) => {
    return crypto.createHash('sha256').update(s).digest('hex')
}

const generateTokenPair = (data: {name: string}) => {
    const accessToken = jwt.sign(
        data,
        config.atSecret,
        { expiresIn: config.atLife }
    )
    const refreshToken = jwt.sign(
        { atTokenHash: hash(accessToken) },
        config.rtSecret,
        { expiresIn: config.rtLife }
    )
    const tokensData = JSON.parse(fs.readFileSync('tokensData.json'))
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

app.use(cors({
    origin: originCors,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/reg',async (req: Request, res: Response)=>{
    console.log('Запрос с сервера получен')
    const newUser = req.body
    const usersData = fs.readFileSync('usersData.json')
    const parsedUsers = JSON.parse(usersData)

    res.status(200).send('success')

    console.log(newUser)
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
})

app.post('/auth', async (req: Request, res: Response)=>{
    console.log('Запрос с сервера получен')
    const authUser = req.body
    const usersData = fs.readFileSync('usersData.json')
    const parsedUsers = JSON.parse(usersData)

    console.log(authUser)
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
})


app.post('/check',async (req: Request, res: Response)=>{
    console.log('Запрос с клиента получен')
    const checkedUser = req.body
    const usersData = fs.readFileSync('usersData.json')
    const parsedUsers = JSON.parse(usersData)

    console.log(checkedUser, 'check user')

    // const existedUser = parsedUsers.find((user)=> user.name === checkedUser.name)
    // if (existedUser) {
    //     if(existedUser.password === checkedUser.password) {
    //         res.status = 200
    //         res.send(existedUser)
    //     } else {
    //         res.status = 200
    //         res.send({
    //             name: existedUser.name,
    //             password: null
    //         })
    //     }
    // } else {
    //     res.status = 200
    //     res.send({
    //         name: null,
    //         password: null,
    //     })
    // }
})

const PORT = 6000

app.listen(PORT, ()=>{
    console.log(`server is listening on port ${PORT}`)
})
