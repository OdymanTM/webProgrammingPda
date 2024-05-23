import pool from './testing_db.mjs';

class Table   {
    constructor(name, locationInStore) {
        this.name = name;
        this.locationInStore = locationInStore; 
    }

    static async isTableAvailable  (callback)  {
        const query = 'SELECT t.tableid, o.status FROM "table" as t LEFT JOIN "order" as o ON t.tableid = o.tableid where o."orderId" = (select "orderId" from "order" order by "timeExecuted" desc limit 1) or o.status is null'
        try {
            const { rows } = await pool.query(query);
              callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    static async getTablesStatus  (tableid, callback)  {
        const query = 'SELECT * FROM "order" WHERE "tableid" = $1 order by "timeExecuted" desc limit 1'
        try {
            const { rows } = await pool.query(query, [tableid]);
            if (rows.length == 0) {
              callback(null, 'Free')
            } else if (rows[0].status == 'Paid' || rows[0].status == 'Cancelled') {
              callback(null, 'Free')
             
            } else {
              callback(null, 'Occupied')
            }
          } catch (err) {
            callback(err, null)
          }
    }
    
    static async addTable  (name, locationInStore, callback)  {
        const query = 'INSERT INTO "table" (name, tablelocation) VALUES ($1, $2)'
        try {
            const { rows } = await pool.query(query, [name, locationInStore]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    static async getAllTables (callback) {
        const query = 'SELECT * FROM "table" order by "tablelocation"'
        try{
          const { rows } = await pool.query(query);
          callback(null, rows)
        }
        catch(err){
          callback(err,null)
        }
    }

    static async getTablesByLocationInStore  (locationInStore, callback)  {
        const query = 'SELECT * FROM "table" WHERE tablelocation = $1'
        try {
            const { rows } = await pool.query(query, [locationInStore]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    static async getTableByName  (name, callback)  {
        const query = 'SELECT * FROM "table" WHERE name = $1'
        try {
            const { rows } = await pool.query(query, [name]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    static async getTableIdByName (name, callback){
      const query = 'SELECT id FROM "table" WHERE name = $1'
      try{
        const { rows } = await pool.query(query, [name]);
        callback(null, rows)
      }
      catch(err){
        callback(err, null)
      }
    }

    static async deleteTable  (name, callback)  {
        const query = 'DELETE FROM "table" WHERE name = $1'
        try {
            const { rows } = await pool.query(query, [name]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    static async getTableLocations(callback) {
        const query = "SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'tablelocations';"
        try {
            const { rows } = await pool.query(query);
            for (let i = 0; i < rows.length; i++) {
                rows[i] = rows[i].enumlabel
            }
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    
    static async updateTableLocation  (name, locationInStore, callback)  {
        const query = 'UPDATE "table" SET tablelocation = $1 WHERE "name" = $2'
        try {
            const { rows } = await pool.query(query, [locationInStore, name]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

}

export default Table;