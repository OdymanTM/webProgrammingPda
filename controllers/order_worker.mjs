import OrderItem from "../models/order.mjs";
import Table from "../models/table.mjs";
import jwt from 'jsonwebtoken';
import pool from '../models/testing_db.mjs';

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
        await OrderItem.addOrderItems(client, result[0].orderId, basket, null, username, async (err, data) => {
            if (err) {
                res.status(500).send('Error adding to the order');
                throw err;
            } else {
                req.session.worker.basket = [];
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

export async function selectTableforOrder(req, res){
    const table = req.params.tableid;
    await Table.isTableAvailable(table, (err, result) => {
        if (err) {
        } else {
            if (result) {
                req.session.worker.table = table;
                res.redirect('/worker/menu');
            } else {
                res.status(500).send('Table not available, please select another table.');
            }
        }
    });
}

export async function selectedTableCheck(req, res, next) {
    await Table.isTableAvailable(req.session.worker.table, (err, result) => {
        if (err) {
        } else {
            if (result) {
                next();
            } else {
                res.status(500).send('Check table selection');
            }
        }
    });
}
