import pool from './testing_db.mjs';

class menuItem   {
    constructor({id, size, category, name, description, producedByPosition, availability = true}) {
        this.id = id;
        this.size = size;
        this.category = category;
        this.name = name;
        this.description = description;
        this.producedByPosition = producedByPosition;
        this.availability = availability;

    }
    static async getAvailableCategories (callback) {
        const query = 'SELECT DISTINCT category FROM "menuItem" WHERE availability = true order by category'
        try {
            const { rows } = await pool.query(query);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }


    static async getAllMenuItems(callback) {
        const query = 'SELECT * FROM "menuItem" WHERE availability = true order by "category", "name"'
        try {
            const { rows } = await pool.query(query);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    static async deleteMenuItem(id, callback) {
        const query = 'DELETE FROM menuItem WHERE id = $1'
        try {
            const { rows } = await pool.query(query, [id]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }
    //not sure it works
    static async updateMenuItem  (id, size, category, name, description, producedByPosition, callback, availability = true)  {
        const query = 'UPDATE menuItem SET size = $1, category = $2, name = $3, description = $4, producedByPosition = $5, availability = $6 WHERE id = $7'
        try {
            const { rows } = await pool.query(query, [size, category, name, description, producedByPosition, availability, id]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    static async addMenuItem  (size, category, name, description, producedByPosition, callback, availability = true)  {
        const query = 'INSERT INTO menuItem (size, category, name, description, producedByPosition) VALUES ($1, $2, $3, $4, $5, $6)'
        try {
            const { rows } = await pool.query(query, [size, category, name, description, producedByPosition, availability]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    static async getMenuItemById(id, callback)  {
        const query = 'SELECT * FROM menuItem WHERE id = $1'
        try {
            const { rows } = await pool.query(query, [id]);
            await callback(null, rows)
          } catch (err) {
            await callback(err, null)
          }
    }

    static async getMenuItemsByName(name, callback)  {
        const query = 'SELECT * FROM menuItem WHERE name = $1'
        try {
            const { rows } = await pool.query(query, [name]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }

    static async getMenuItemsByCategory(category, callback)  {
        const query = 'SELECT * FROM "menuItem" WHERE "category" = $1'
        try {
            const { rows } = await pool.query(query, [category]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }
    
}
export default menuItem;