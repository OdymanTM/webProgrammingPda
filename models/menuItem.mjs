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
            callback(null, rows)
          } catch (err) {
            callback(err, null)
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