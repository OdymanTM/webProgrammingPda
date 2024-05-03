import e from 'express';
import pool from './testing_db.mjs';

class Customer   {
    constructor(email) {
        this.email = email;
    }

    
    
    static async getCustomerByEmail  (email, callback)  {
        const query = 'SELECT * FROM customer WHERE email = $1'
        try {
            const { rows } = await pool.query(query, [email]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    static async addCustomer  (email, callback)  {
        const query = 'INSERT INTO customer (email) VALUES ($1)'
        try {
            const { rows } = await pool.query(query, [email]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }
}
export default Customer;