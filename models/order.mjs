import pool from './testing_db.mjs';

class BaseDatabase{

    
    get_user(email){

    }

    set_user(email){

    }
}

class SQLDatabase extends BaseDatabase{

    get_user(email){

    }

    set_user(email){

    }
}

class JsonDatabase extends BaseDatabase{

}

class MongoDatabase extends BaseDatabase{

}

database = new MongoDatabase();
class OrderItem {
    constructor(orderid, timeExcecuted, isCustomerOrder, totalOrderCost, ) {
        this.id = id;
        this.customerName = customerName;
        this.products = products;
    }

    static async getOrdersOfCustomer(customeremail, callback) {
        const query = 'select * from "order" as o, "editsORcreates" as e where e."orderId"  = e."orderId" and e."customerEmail" = $1;'
        try {
            const { rows } = await pool.query(query, [customeremail]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
    }
    static async updateOrderStatus(orderid, status, callback) {
        const query = 'UPDATE "order" SET "status" = $1 WHERE "orderId" = $2'
        try {
            const { rows } = await pool.query(query, [status, orderid]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }

    }

    

    static async initiateOrder(customeremail, tableid, items, workerUsername=null, callback) {
        if (workerUsername == null) {
            const query = `INSERT INTO "order" ("isCustomerOrder", "status", "timeExecuted", "tableid") VALUES (true, \'Not Ready\', to_timestamp(${Date.now()} / 1000.0), $1) RETURNING "orderId"`
            const query2 = 'INSERT INTO "editsORcreates" ("customerEmail", "orderId", "menuItemId","comment","isOnTheHouse","quantity","size") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
            try {
                const {rows} = await pool.query(query, [tableid]);
                const id = rows[0].orderId;
                console.log(id);
                let lastId = 0;
                for(let item of items){
                    lastId = await pool.query(query2, [customeremail, id, item.id, item.comment, item.isOnTheHouse, item.quantity, item.size]).rows;
                }
                
                callback(null, lastId)
              } catch (err) {
                callback(err, null)
              }
        } else {    
            const query = 'INSERT INTO "editsORcreates" (workerusername) VALUES ($1) RETURNING id'
            try {
                const { rows } = await pool.query(query, [workerUsername]);
                callback(null, rows[0].id)
              } catch (err) {
                callback(err, null)
              }
        }
    }
}

let items = [{
    id: 1,
    comment: "I want it",
    isOnTheHouse: false,
    quantity: 2,
    size: "1"
},
{
    id: 3,
    comment: "I want it bad",
    isOnTheHouse: false,
    quantity: 1,
    size: "2"
},
];
//OrderItem.initiateOrder("palamaris02@gmail.com", 1, items, null, (err, data) => { console.log(data) });
OrderItem.updateOrderStatus(1, 'Ready for service', (err, data) => { console.log(data, err) });

export default OrderItem;