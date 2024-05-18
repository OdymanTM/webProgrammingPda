import express from 'express'
const customer_routes = express.Router();


import * as menuController from '../controllers/menu_customer.mjs';
import * as ordersHistoryController from '../controllers/orders_history.mjs';

const controller = await import(`../controllers/sample_controller.mjs`);

customer_routes.get('/', controller.login);
customer_routes.post('/',controller.loginToPosts);
customer_routes.get('/posts', controller.posts);
customer_routes.get('/menu', menuController.getMenu);
customer_routes.get('/menu/:category', menuController.getOneCategory);
customer_routes.get('/orders_history', ordersHistoryController.getOrdersHistory);


export default customer_routes;