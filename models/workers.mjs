import pool from './testing_db.mjs';
import bcrypt from 'bcrypt';

class Worker   {
    constructor(username, name, isAdmin, totalHours, password) {
        this.username = username;
        this.name = name;
        this.isAdmin = isAdmin;
        this.totalHoursLogged = totalHours;
        this.password = password;
    }

    static async getWorkersUsernames (callback){
        const query = 'SELECT username FROM "worker"';
        try{
            const { rows } = await pool.query(query);
            callback(null, rows);
        }
        catch(err){
            callback(err, null);
        }
    }

    static async isUsernameTaken (username, callback){
        const query = 'SELECT username FROM "worker" where username = $1';
        try{
            const { rows } = await pool.query(query, [username]);
            if (rows.length > 0){
                callback(null, true);
            }
            else{
                callback(null, false);
            }
        }
        catch(err){
            callback(err, null);
        }
    }

    static async getWorkersPassword (username,callback){
        const query = 'SELECT password FROM "worker" where username = $1';
        try{
            const { rows } = await pool.query(query, [username]);
            callback(null, rows);
        }
        catch(err){
            callback(err, null);
        }}

    static async validateWorker (username, password, callback){
        const query = 'SELECT password FROM "worker" where username = $1';
        try{
            const { rows } = await pool.query(query, [username]);
            if (rows.length > 0){
                const isValid = await bcrypt.compare(password, rows[0].password);
                callback(null, isValid);
            }
            else{
                callback(null, false);
            }
        }
        catch(err){
            callback(err, null);
        }
    }

    static async addWorker (username, name, isAdmin, totalHours, password, callback){
        const query = 'INSERT INTO "worker" (username, name, "isAdmin", "totalHoursLogged", password) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        try{
            const passwordHash = await bcrypt.hash(password, 10);
            const { rows } = await pool.query(query, [username, name, isAdmin, totalHours, passwordHash]);
            callback(null, rows);
        }
        catch(err){
            callback(err, null);
        }
    }

}//defaultworker 12345678
//Worker.isUsernameTaken("defaultsworker",(err, res) => {  console.log(res); });
//Worker.addWorker("defaultworker", "default", false, 0, "12345678", (err, res) => {  console.log(res); });
export default Worker;