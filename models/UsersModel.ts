import {pool} from "../db";


const userQuery = (username: string, password: string) => `
        select user_id 
        from store_users 
        where store_user = ${username}) 
        and password = ${password}
    `

class UsersModel {
    async createUser (name: string, password: string) {
        console.log('create user')
        const dbResponse = await pool.query(`insert into store_users (username, password) values ('${name}', '${password}')`);
        console.log(dbResponse, 'create user in db response')
    }

    async getUser (name: string, password: string) {
        console.log('create user')
        const userData = await pool.query(`select user_id from store_users where store_user = ${name}) and password = ${password}`);
        console.log(userData.rows, 'user data')
    }
}

export const usersModel = new UsersModel()