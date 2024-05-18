import express from 'express'
const router = express.Router();

import * as menuControllerCustomer from '../controllers/menu_customer.mjs';
import * as menuController from '../controllers/menu_worker.mjs';
import * as ordersHistoryController from '../controllers/orders_history_worker.mjs';
import * as tablesController from '../controllers/tables_worker.mjs';

const controller = await import(`../controllers/sample_controller.mjs`);

router.get('/', controller.login);
router.post('/',controller.loginToPosts);
router.get('/posts', controller.posts);
router.get('/menu', menuController.getMenu);
router.get('/menu/:category', menuController.getOneCategory);
router.get('/orders_history', ordersHistoryController.getOrdersHistory);
router.get('/tables', tablesController.getTables);
router.get('/tables/:sector', tablesController.getOneLocation);

export default router;

/* 
app.get('/', (req,res) => {
  res.render('posts', { pageTitle: pageTitle});
});

app.get('/orders_history', (req, res) => {
  pageTitle = 'Orders History';
  res.render('orders_history', { pageTitle: pageTitle, orders: ordersHistory.orders});
});

app.get('/tables', (req,res) => {
  pageTitle = 'Tables';
  res.render('tables', {pageTitle: pageTitle, tables: tables.tables});
});

*/