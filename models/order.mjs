import pool from './testing_db.mjs';
class OrderItem {
    constructor(orderid, timeExcecuted, isCustomerOrder, totalOrderCost, ) {
        this.id = id;
        this.customerName = customerName;
        this.products = products;
    }

    static async getOrdersOfCustomer(customeremail, callback) {
        const query = 'select distinct o."totalOrderCost" ,o."timeExecuted" ,o."isCustomerOrder" ,o.status ,o.tableid, o.customeremail from "order" as o where o.customeremail = $1;'
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

    static async getOrderItems(orderid, callback) {
      const query = `select a.id ,a."comment" ,a.isonthehouse ,a."size" ,a.customeremail ,a.menuitemid ,a.menuitemid ,a.workerusername  from "order" as o, "orderAddition" as e, "addition" as a where e."orderId"  = o."orderId" and e.additionid = a.id and o."orderId" = $1;`
      try {
        const { rows } = await pool.query(query, [orderid]);
        callback(null, rows)
      } catch (err) {
        callback(err, null)
      }
    }

    static async addOrderItems(orderid, items, customerEmail=null, workerUsername=null,callback) {
      let query = `INSERT INTO "addition" ("workerusername","customeremail", "menuitemid","comment","isonthehouse","size") VALUES  ($1, $2, $3, $4, $5, $6) RETURNING *`
      let query1 = `INSERT INTO "orderAddition" ("orderId", "additionid") VALUES  (${orderid}, $1) RETURNING *`
      const client = await pool.connect();
      try {
        await client.query('BEGIN');  
        let lastRow = '';      
        for(let item of items) {
                  for (let i = 0; i < item.quantity; i++){
                    lastRow = await client.query(query, [workerUsername, customerEmail,item.id ,item.comment, item.isOnTheHouse, item.size]);
                    await client.query(query1, [lastRow.rows[0].id]).rows;
              }}
              await client.query('COMMIT');
        callback(null, lastRow.rows)
      } catch (err) {
        await client.query('ROLLBACK'); 
        callback(err, null);
      }finally {
        client.release();
      }
    }

    static async initiateOrder(tableid,isCustomerOrder , callback) {
      const query = `INSERT INTO "order" ("isCustomerOrder", "status", "timeExecuted", "tableid") VALUES (${isCustomerOrder}, \'Not Ready\', to_timestamp(${Date.now()} / 1000.0), $1) RETURNING "orderId"`
      try {
        const { rows } = await pool.query(query, [tableid]);
        callback(null, rows)
      } catch (err) {
        callback(err, null)
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
//OrderItem.getOrderItems(16, (err, data) => { console.log(data, err) });
//OrderItem.addOrderItems(16,items, "palamaris02@gmail.com" ,null, (err, data) => { console.log(data, err) });
//OrderItem.initiateOrder(1, true, (err, data) => { console.log(data, err) });
//OrderItem.getOrdersOfCustomer("palamaris02@gmail.com", (err, data) => { console.log(data, err) });
export default OrderItem;