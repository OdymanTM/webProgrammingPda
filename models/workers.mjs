import pool from './testing_db.mjs';

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

    static async getWorkersPassword (username,callback){
        const query = 'SELECT password FROM "worker" where username = $1';
        try{
            const { rows } = await pool.query(query, [username]);
            callback(null, rows);
        }
        catch(err){
            callback(err, null);
        }}
}//defaultworker 12345678
//Worker.getWorkersPassword("defaultworker",(err, res) => {  console.log(res); });
export default Worker;