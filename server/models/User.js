import { pool } from '../helpers/db.js'

const insertUser = async (username, hashedPassword) => {
    return await pool.query('insert into public."User" (username,password) values ($1,$2) returning *', [username, hashedPassword])
}

const selectUserByEmail = async (username) => {
    return await pool.query('select * from public."User" where username = $1', [username])
}

const deleteUser = async (username) => {
    return await pool.query('DELETE FROM public."User" WHERE username = $1',[username])
    
  };

export { insertUser, selectUserByEmail, deleteUser }