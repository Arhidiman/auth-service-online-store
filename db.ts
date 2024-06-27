import pkg from 'pg';
const { Pool } = pkg;
import config from './config.ts';

const { db } = config;

export const pool = new Pool({
    user: db.user,
    host: db.host,
    database: db.database,
    password: db.password,
    port: db.port,
});