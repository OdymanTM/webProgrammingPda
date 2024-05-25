import OrderItem from "../models/order.mjs";

export async function submitOrder(req, res, next) {
    const table = req.session.worker.table;
    const basket = req.session.worker.basket;
    let username;
    jwt.verify(req.session.token, 'omada22', (err, data) => {
        if (err) throw err;
        username = data.username;
    });

    if(basket == undefined ||  basket.length == 0) {
        res.status(500).send('Basket is empty');
        next();
    }else{
    const client = await pool.connect();    
    try {
    await client.query('BEGIN');  
    await OrderItem.initiateOrder(client, table, false, null ,async (err, result) => {
        if (err) {
            res.status(500).send('Error initiating order')
            throw err;
        }
        await OrderItem.addOrderItems(client, result[0].orderId, basket, username, null, async (err, data) => {
            if (err) {
                res.status(500).send('Error adding to the order');
                throw err;
            } else {
                req.session.basket = [];
                await client.query('COMMIT');
                res.status(200).send('OrderSubmitted');
            }
        });
        });}
    catch (err) {
        await client.query('ROLLBACK'); 
    }
    finally {
        client.release();
    }
}
}

export async function addToOrder (req, res) {
    
} 