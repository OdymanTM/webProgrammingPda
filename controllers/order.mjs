import Table from '../models/table.mjs';    
import OrderItem from '../models/order.mjs';
import pool from '../models/testing_db.mjs';

export async function tableCheck(req, res) {
    const table = req.params.tableid;
    await Table.isTableAvailable(table, (err, result) => {
        if (err) {
        } else {
            if (result) {
                req.session.table = table;
                res.redirect('/menu');
            } else {
                res.status(500).send('Table not available speak with personel');
            }
        }
    });
}

export async function noOtherActiveOrderCheck(req, res, next) {
    await OrderItem.getLastOrderOfCustomer(req.session.passport.user, (err, result) => {
        if (err) {
            res.status(500).send('Error getting last order');
        } else {
            if (result.status === 'Paid' || result.status === 'Cancelled') {
                return next();
            } else {
                res.status(500).send('You have an active order');
            }
        }
    });
}


export async function selectedTableCheck(req, res, next) {
    if (req.session.table) {
        return next();
    } else {
        res.status(500).send('Error with table selection');}
    }


export async function loggedinCheck (req, res, next) {
    if (req.session.passport) {
        return next();
    } else {
        res.redirect('/auth/google');
    }
}

export async function submitOrder(req, res, next) {
    const table = req.session.table;
    const basket = req.session.basket;
    if(basket == undefined ||  basket.length == 0) {
        res.status(500).send('Basket is empty');
        next();
    }else{
    const client = await pool.connect();    
    try {
    await client.query('BEGIN');  
    await OrderItem.initiateOrder(client, table, true, req.session.passport.user ,async (err, result) => {
        if (err) {
            res.status(500).send('Error initiating order')
            throw err;
        }
        await OrderItem.addOrderItems(client, result[0].orderId, basket, req.session.passport.user, null, async (err, data) => {
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