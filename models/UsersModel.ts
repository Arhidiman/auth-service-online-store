import {pool} from "../db";

const roles: {admin: 'administrator', user: "user"} = {
    admin: 'administrator',
    user: "user"
}


// select username, user_id, user_role, jwt_token
interface IUser {
    username: string | undefined,
    user_id: string | undefined,
    user_role: string | undefined,
    iwt_token: string | undefined
}

const userQuery = (username: string, password: string) => `
        select user_id 
        from store_users 
        where store_user = ${username}) 
        and password = ${password}
    `

class UsersModel {
    async createUser (username: string, password: string, accessToken: string): Promise<IUser | undefined> {
        console.log('create user')

        const createQuery = `
                insert 
                into store_users (username, password, jwt_token, user_role) 
                values ('${username}', '${password}', '${accessToken}', '${roles.user}')
                returning username, user_id, user_role, jwt_token 
            `

        const dbResponse = await pool.query(createQuery)

        console.log(dbResponse.rows, 'create user in db response')

        return dbResponse.rows[0]
    }



    async getUser (username: string, password: string, accessToken?: string): Promise<IUser | undefined> {
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