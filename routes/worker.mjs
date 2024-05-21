import express from 'express'
const worker_routes = express.Router();

import * as menuController from '../controllers/menu_worker.mjs';
import * as ordersHistoryController from '../controllers/orders_history_worker.mjs';
import * as tablesController from '../controllers/tables_worker.mjs';
import * as worker_controller from '../controllers/worker_login.mjs';
//const controller = await import(`../controllers/sample_controller.mjs`);

worker_routes.get('/', worker_controller.login);
worker_routes.post('/',worker_controller.loginToPosts);
worker_routes.get('/register', worker_controller.register);
worker_routes.post('/register', worker_controller.registerToLogin);
worker_routes.get('/posts', worker_controller.authenticateToken, worker_controller.posts);
worker_routes.get('/menu',worker_controller.authenticateToken, menuController.getMenu);
worker_routes.get('/menu/:category',worker_controller.authenticateToken, menuController.getOneCategory);
worker_routes.get('/orders_history',worker_controller.authenticateToken, ordersHistoryController.getOrdersHistory);
worker_routes.get('/tables',worker_controller.authenticateToken, tablesController.getTables);
worker_routes.get('/tables/:sector',worker_controller.authenticateToken, tablesController.getOneLocation);

export default worker_routes;

