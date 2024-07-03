import {pool} from "../db";

const roles: {admin: 'administrator', user: "user"} = {
    admin: 'administrator',
    user: "user"
}

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
                into store_users (username, password, jwt_token, user_role) 
                values ('${name}', '${password}', '${accessToken}', '${roles.user}')
            `
        )
        console.log(dbResponse.rows, 'create user in db response')
    }

    async getUser (username: string, password: string, accessToken?: string) {
        console.log('create user')


        const query = `
            select username, user_id, user_role, jwt_token
            from store_users 
            where username = '${username}' 
            and password = '${password}'
        `

        console.log(query, 'USER DB QUERY')

        const userData = await pool.query(query)
        if (userData) {
            console.log(userData.rows, 'user data')
            return userData && userData.rows[0]
        } else {console.log('user not found')}
    }
}

export const usersModel = new UsersModel()