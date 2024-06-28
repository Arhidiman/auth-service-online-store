import {Request, Response} from "express";

const fs = require('fs')
const express = require('express')
const cors = require("cors")

const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('./config')

const bodyParser = require("body-parser");

import {AuthRouter} from "./routers/AuthRouter.ts";

const app = express()
const originCors = true
const hash = (s: string) => {
    return crypto.createHash('sha256').update(s).digest('hex')
}

app.use(express.json()); // Обработка JSON-запросов
app.use('/user', AuthRouter)


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



const PORT = 6000

app.listen(PORT, ()=>{
    console.log(`server is listening on port ${PORT}`)
})
