import express from 'express'
const customer_routes = express.Router();

import * as menuController from '../controllers/menu_customer.mjs';
import * as ordersHistoryController from '../controllers/orders_history.mjs';
import * as basketController from '../controllers/basket.mjs';

customer_routes.get('/menu', menuController.getMenu);
customer_routes.get('/menu/:category', menuController.getOneCategory);
customer_routes.get('/orders_history', ordersHistoryController.getOrdersHistory);
customer_routes.get('/basket', basketController.getBasket);
customer_routes.post('/basket/add', (req, res) => {
    //{ id: '1', quantity: '1', comment: '' }
    let item = req.body;
    item.id = parseInt(req.body.id); 
    item.quantity = parseInt(req.body.quantity);
    item.price = parseFloat(req.body.price);
    req.session.basket = req.session.basket || []; 
    req.session.basket.push(item);
    //console.log(item);
    //console.log(req.session);
    res.redirect('/menu');
  });
  

export default customer_routes;