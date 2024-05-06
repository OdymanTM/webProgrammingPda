import pool from './testing_db.mjs';

class Basket   {
    constructor(id) {
        this.id = id;
    }

    static async clearBasket  (customeremail, callback)  {
        const query = 'DELETE  FROM "itemsinsidebasket" WHERE customeremail = $1'
        try {
            const { rows } = await pool.query(query, [customeremail]);
            callback(null, rows)
            } catch (err) {
            callback(err, null)
            }
    }
    
    static async insertItemToBasket  (customeremail, menuitem, callback)  {
        const query = 'INSERT INTO "itemsinsidebasket" (customeremail, menuitem) VALUES ($1, $2)'
        try {
            const { rows } = await pool.query(query, [customeremail, menuitem]);
            callback(null, rows)
            } catch (err) {
            callback(err, null)
            }
    }


    static async getNumberofBasketItems (customeremail, callback)  {
        const query = 'SELECT COUNT(*) FROM "itemsinsidebasket" WHERE customeremail = $1'
        try {
            const { rows } = await pool.query(query, [customeremail]);
            callback(null, rows[0].count)
            } catch (err) {
            callback(err, null)
            }

    }

    static async getBasketItems (customeremail, callback)  {
        const query = 'select * from "menuItem" where "menuItem".id in (SELECT "menuitem"  FROM "itemsinsidebasket" WHERE "customeremail" = $1)';
        const query2 = 'SELECT "quantity" FROM "itemsinsidebasket" WHERE "customeremail" = $1 AND "menuitem" = $2'
        try {
            let quantity;
            const { rows } = await pool.query(query, [customeremail]);
            for (let i = 0; i < rows.length; i++) {    
                quantity = await pool.query(query2, [customeremail, parseInt(rows[i].id)]);
                rows[i].quantity = quantity.rows[0].quantity
            }
            callback(null, rows)
            } catch (err) {
            callback(err, null)
            }

    }

}

export default Basket;