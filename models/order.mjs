import pool from './testing_db.mjs';
class OrderItem {
    constructor(orderid, timeExcecuted, isCustomerOrder, totalOrderCost, ) {
        this.id = id;
        this.customerName = customerName;
        this.products = products;
    }

    static async getLastOrderOfCustomer(customeremail, callback) {
        const query = 'select * from "order" where customeremail = $1 order by "timeExecuted" desc limit 1;'
        try {
            const { rows } = await pool.query(query, [customeremail]);
            callback(null, rows)
          } catch (err) {
            callback(err, null)
          }
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


    static async getActiveOrders(callback) {
      const query = 'SELECT * FROM "order" NATURAL JOIN "table" WHERE status NOT IN (\'Paid\', \'Cancelled\') order by "timeExecuted"'
      try {
        const { rows } = await pool.query(query);
        callback(null, rows)
      } catch (err) {
        callback(err, null)
      }
    }

    static async getNotActiveOrders(callback) {
      const query = 'SELECT * FROM "order" WHERE status IN (\'Paid\', \'Cancelled\') order by "timeExecuted"'
      try {
        const { rows } = await pool.query(query);
        callback(null, rows)
      } catch (err) {
        callback(err, null)
      }
    }

    static async getOrderItems(orderid, callback) {
      const query = `select a.id ,a."comment" ,a.isonthehouse ,a.customeremail,a.workerusername ,m.name,m.size,m.category ,m.id, m.price\
        from "order" as o, "orderAddition" as e,"menuItem" as m,  "addition" as a where m.id = a.menuitemid and e."orderId"  = o."orderId"\
         and e.additionid = a.id and o."orderId" = $1;`
      try {
        const { rows } = await pool.query(query, [orderid]);
        callback(null, rows)
      } catch (err) {
        callback(err, null)
      }
    }

    static async addOrderItems(client, orderid, items, customerEmail=null, workerUsername=null,callback) {
      let query = `INSERT INTO "addition" ("workerusername","customeremail", "menuitemid","comment","isonthehouse") VALUES  ($1, $2, $3, $4, $5) RETURNING *`
      let query1 = `INSERT INTO "orderAddition" ("orderId", "additionid") VALUES  (${orderid}, $1) RETURNING *`
      let outside_client = client ? true : false;
      client = client ? client : await pool.connect();
      try {
        await client.query('BEGIN');  
        let lastRow = '';      
        for(let item of items) {
                  for (let i = 0; i < item.quantity; i++){
                    if (item.isOnTheHouse == undefined) {
                      item.isOnTheHouse = false;
                    }
                    lastRow = await client.query(query, [workerUsername, customerEmail,item.id ,item.comment, item.isOnTheHouse]);
                    
                    await client.query(query1, [lastRow.rows[0].id]);
              }}
              if (!outside_client) await client.query('COMMIT');
        callback(null, lastRow.rows)
      } catch (err) {
        if (!outside_client) await client.query('ROLLBACK'); 
        callback(err, null);
      }finally {
        if (!outside_client) client.release();
      }
    }

    static async initiateOrder(client, tableid, isCustomerOrder, customerEmail , callback) {
      client = client ? client : pool;
      const query = `INSERT INTO "order" ("isCustomerOrder", "status", "timeExecuted", "tableid", "customeremail") VALUES (${isCustomerOrder}, \'Not Ready\', current_timestamp, $1, $2) RETURNING "orderId"`
      try {
        const { rows } = await client.query(query, [tableid, customerEmail]);
        callback(null, rows)
      } catch (err) {
        callback(err, null)
      }
    }
}

// let items = [{
//     id: 1,
//     comment: "I want it",
//     isOnTheHouse: false,
//     quantity: 2,
// },
// {
//     id: 2,
//     comment: "I want it bad",
//     isOnTheHouse: false,
//     quantity: 1,
// },
// ];
//let id;
// OrderItem.getOrderItems(56, (err, data) => { console.log(data, err) });
//await OrderItem.initiateOrder(1, true, 'palamaris02@gmail.com',(err, data) => { 
//  id = data[0].orderId;
//  console.log(data, err) 
//});
//await OrderItem.addOrderItems(id,items, "palamaris02@gmail.com" ,null, (err, data) => { console.log(data, err) });
//OrderItem.getOrdersOfCustomer("palamaris02@gmail.com", (err, data) => { console.log(data, err) });
// await OrderItem.updateOrderStatus(56, 'Paid', (err, data) => {
//   console.log(data, err);
// });
export default OrderItem;