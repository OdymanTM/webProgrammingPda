//import pg from 'pg';
import pg from 'pg'
import dotenv from 'dotenv';

dotenv.config();

//let pool = new pg.Pool({
//    user: process.env.user,
//    host: process.env.host,
//    database: process.env.database,
//    password: process.env.password,
//    port: process.env.port,
//  });

  const pool =new pg.Pool({connectionString: process.env.URL})



export default pool;
