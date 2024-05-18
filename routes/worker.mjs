import express from 'express'
const worker_routes = express.Router();

import * as menuController from '../controllers/menu_worker.mjs';
import * as ordersHistoryController from '../controllers/orders_history_worker.mjs';
import * as tablesController from '../controllers/tables_worker.mjs';

const controller = await import(`../controllers/sample_controller.mjs`);

worker_routes.get('/', controller.login);
worker_routes.post('/',controller.loginToPosts);
worker_routes.get('/posts', controller.posts);
worker_routes.get('/menu', menuController.getMenu);
worker_routes.get('/menu/:category', menuController.getOneCategory);
worker_routes.get('/orders_history', ordersHistoryController.getOrdersHistory);
worker_routes.get('/tables', tablesController.getTables);
worker_routes.get('/tables/:sector', tablesController.getOneLocation);

export default worker_routes;

