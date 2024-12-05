import pkg from 'pg'

const { Pool } = pkg


const openDb = () => {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        password:'', // Määrittämäsi salasana
        database: '',
        port: 5432
    })
    return pool
}

const pool = openDb()


export{ pool }

