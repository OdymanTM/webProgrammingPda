import express from 'express'; 
import OrderItem from '../models/order.mjs';

const ordersHistory = {
    "orders": [
      {
        "price": "17.70€",
        "table": "Table 4",
        "date": "08 April 2023",
      },
      {
        "price": "35.70€",
        "table": "Table 2",
        "date": "19 May 2023",
      },
      {
        "price": "25.70€",
        "table": "Table 1",
        "date": "19 July 2023",
      },
      {
        "price": "19.30€",
        "table": "Table 4",
        "date": "Today",
        "status": "paid!"
      },
      {
        "price": "22.50€",
        "table": "Table 3",
        "date": "Today",
        "status": "not paid!"
      }
    ]
}

async function getOrdersHistory (req, res) {
    let pageTitle = 'Orders History';
    OrderItem.getOrdersOfCustomer('palamaris', (err, orders) => {console.log(err, orders)});
    res.render('orders_history_customer', {layout: 'main_customer' ,pageTitle: pageTitle, orders: ordersHistory.orders});
}

export { getOrdersHistory }