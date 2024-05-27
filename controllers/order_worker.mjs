import OrderItem from "../models/order.mjs";
import Table from "../models/table.mjs";
import jwt from 'jsonwebtoken';
import pool from '../models/testing_db.mjs';
import { stat } from "fs";

export async function submitOrder(req, res, next) {
    const table = req.cookies.worker_table;
    const basket = req.cookies.worker_basket;
    let username;
    jwt.verify(req.cookies.worker, 'omada22', (err, data) => {
        if (err) throw err;
        username = data.username;
    });

    if(basket == undefined ||  basket.length == 0) {
        res.status(500).send('Basket is empty');
    }else{
    const client = await pool.connect();    
    await Table.getTableStatus(table, async (err, status) => {
        if(status == null || !status[0]){
            status = [ {} ]
        }
        if(status[0].status == 'Not Ready'|| status[0].status == 'Standby' || status[0].status == 'Ready for service' ) {
            await OrderItem.addOrderItems(null, status[0].orderId, basket, null, username, async (err, data) => {
                if (err) {
                    res.status(500).send('Error adding to the order');
                } else {
                    res.cookie('worker_basket', [], { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: true });
                    res.status(200).send('Items added to the order');
                }
            });
        } else {
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
                            res.cookie('worker_basket', [], { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: true });
                            await client.query('COMMIT');
                            res.status(200).send('OrderSubmitted');
                        }
                    });
                });
            } catch (err) {
                await client.query('ROLLBACK'); 
            }
            finally {
                client.release();
            }
        }
        });
    }
}


export async function selectTableforOrder(req, res){
    const table = req.params.tableid;
    res.cookie('worker_table', table, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: true });
    res.redirect('/worker/menu');

}

export async function selectedTableCheck(req, res, next) {
    if (req.cookies.worker_table == undefined) {
        res.status(500).send('Table not selected');
    } else {
    next();
    }
}
