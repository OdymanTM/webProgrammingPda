import Table from '../models/table.mjs';    
import OrderItem from '../models/order.mjs';

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

export async function selectedTableCheck(req, res, next) {
    if (req.session.table) {66
        return next();66
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
    if(basket.length == 0) {
        res.status(500).send('Basket is empty');
        next();
    }else{
    await OrderItem.initiateOrder(table, true, req.session.passport.user ,async (err, result) => {
        if (err) {
            res.status(500).send('Error initiating order')}
            await OrderItem.addOrderItems(result[0].orderId, basket, req.session.passport.user, null, async (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Error adding to the order');
                } else {
                    req.session.basket = [];
                    res.status(200).send('OrderSubmitted');
                }
            });
        });}
}