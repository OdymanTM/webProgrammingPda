import pool from './testing_db.mjs';

class Table   {
    constructor(name, locationInStore) {
        this.name = name;
        this.locationInStore = locationInStore; 
    }

    static async  getTablesStatuses (callback)  {
        const query = 'SELECT distinct on (t.tableid) t.tablelocation, t."name", t.tableid , o.status, o."timeExecuted" FROM "table" as t LEFT JOIN "order" as o ON t.tableid = o.tableid order by t.tableid, o."timeExecuted" desc'
        try {
            const { rows } = await pool.query(query);
              callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    static async getTableStatus (tableid, callback) {
        const query = 'SELECT status, "orderId" FROM "order" WHERE "tableid" = $1 order by "timeExecuted" desc limit 1'
        try {
            const { rows } = await pool.query(query, [tableid]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    static async getLastOrderOfTable (tableid, callback) {
      const query = 'select distinct m."name" , m.category,o.status, o."orderId", a."comment" , m."size", m.price  from "order" as o, "table" as t, "addition" as a, "orderAddition" as oa, "menuItem" as m\
      where o."orderId"  = (select "orderId" from "order" where $1 = "tableid" order by "timeExecuted" desc limit 1) and oa."orderId" = o."orderId" and oa.additionid = a.id\
      and m.id = a.menuitemid'
      try {
          const { rows } = await pool.query(query, [tableid]);
            callback(null, rows)
        } catch (err) {
          callback(err, null)
        }
    }

    static async isTableAvailable  (tableid, callback)  {
        const query = 'SELECT * FROM "order" WHERE "tableid" = $1 order by "timeExecuted" desc limit 1'
        try {
            const { rows } = await pool.query(query, [tableid]);
            if (rows.length == 0) {
              callback(null, true)
            } else if (rows[0].status == 'Paid' || rows[0].status == 'Cancelled') {
              callback(null, true)
             
            } else {
              callback(null, false)
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