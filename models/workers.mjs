import pool from './testing_db.mjs';

class Worker   {
    constructor(id, username, name, isAdmin, totalHours, password) {
        this.id = id;
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

    static async getWorkersPasswords (callback){
        const query = 'SELECT password FROM "worker"';
        try{
            const { rows } = await pool.query(query);
            callback(null, rows);
        }
        catch(err){
            callback(err, null);
        }
    }
}

export default Worker;