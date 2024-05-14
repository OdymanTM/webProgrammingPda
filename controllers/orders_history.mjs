import express from 'express'; 
import order from '../models/menuItem.mjs';

async function getOrdersHistory (req, res) {
    pageTitle = 'Orders History';
    res.render('orders_history', { pageTitle: pageTitle, orders: ordersHistory.orders});
}

export { getMenu, getOneCategory };