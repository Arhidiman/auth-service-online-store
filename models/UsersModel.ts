import {pool} from "../db";
import pg from 'pg'
import {is} from "@babel/types";
import {HTTPError, isPostgresError} from "../lib";

const roles: {admin: 'administrator', user: "user"} = {
    admin: 'administrator',
    user: "user"
}


interface PostgresError extends Error {
    code: string;
    detail?: string;
    hint?: string;
    position?: string;
    internalPosition?: string;
    internalQuery?: string;
    where?: string;
    schema?: string;
    table?: string;
    column?: string;
    dataType?: string;
    constraint?: string;
    file: string;
    line: string;
    routine: string;
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
        try {
            const dbResponse = await pool.query(createQuery)

            console.log(dbResponse.rows, 'create user in db response')

            return dbResponse.rows[0]
        } catch (err: any) {

            if (isPostgresError(err)) {
                const pgError = err as PostgresError
                if (pgError.code === '23505') {
                    console.log(pgError)
                    throw new HTTPError(`Пользователь с именем ${username} уже существует`, 400)
                }
                if (pgError.code === '22001') {
                    console.log(pgError)
                    throw new HTTPError(`Слишком длинное имя пользователя`, 400)
                }
                else {
                    console.log(pgError)
                    throw new HTTPError(`${err.message}`, 500)
                }
            }


        }

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