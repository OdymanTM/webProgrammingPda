import Table from '../models/table.mjs';    
import OrderItem from '../models/order.mjs';
import pool from '../models/testing_db.mjs';

export async function tableCheck(req, res) {
    const table = req.params.tableid;
    await Table.isTableAvailable(table, (err, result) => {
        if (err) {
        } else {
            if (result) {
                res.cookie('table', table, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: true });
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
            if (result[0].status === 'Paid' || result[0].status === 'Cancelled') {
                return next();
            } else {
                res.status(500).send('You have an active order');
            }
        }
    });
}


export async function selectedTableCheck(req, res, next) {
    if (req.cookies.table) {
        return next();
    } else {
        res.status(500).send('Error with table selection');}
    }


export async function loggedinCheck (req, res, next) {
    if (req.session.passport) {
        next();
    } else {
        res.status(500).send('You must login first!');
    }
}

export async function submitOrder(req, res, next) {
    const table = req.cookies.table;
    const basket = req.cookies.basket;
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
                await client.query('COMMIT');
                res.cookie('basket', [], { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: true });
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