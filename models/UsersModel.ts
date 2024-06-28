import {pool} from "../db";


const userQuery = (username: string, password: string) => `
        select user_id 
        from store_users 
        where store_user = ${username}) 
        and password = ${password}
    `

class UsersModel {
    async createUser (name: string, password: string, accessToken: string) {
        console.log('create user')
        const dbResponse = await pool.query(`
                insert 
                into store_users (username, password, jwt_token) 
                values ('${name}', '${password}', '${accessToken}')
            `
        )
        console.log(dbResponse, 'create user in db response')
    }

    async getUser (name: string, password: string, accessToken?: string) {
        console.log('create user')
        const userData = await pool.query(`
                select user_id 
                from store_users 
                where username = '${name}' 
                and password = '${password}'
            `
        )
        if (userData) {
            console.log(userData.rows, 'user data')
            return userData.rows
        } else {console.log('user not found')}
    }
}

export const usersModel = new UsersModel()