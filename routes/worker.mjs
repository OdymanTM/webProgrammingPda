import express from 'express'
const worker_routes = express.Router();
import jwt from 'jsonwebtoken';
import * as menuController from '../controllers/menu_worker.mjs';
import * as ordersHistoryController from '../controllers/orders_history_worker.mjs';
import * as tablesController from '../controllers/tables_worker.mjs';
import * as worker_controller from '../controllers/worker_login.mjs';
import * as basketController from '../controllers/basket_worker.mjs';
import * as orderWorkerController from '../controllers/order_worker.mjs';

worker_routes.get('/register', worker_controller.register);
worker_routes.post('/register', worker_controller.registerToLogin);
worker_routes.get('/', worker_controller.login);
worker_routes.post('/',worker_controller.loginToPosts);

worker_routes.use(
    (req, res, next) => {
        if (req.session.token) {
            jwt.verify(req.session.token, 'omada22', (err, data) => {
                if (err) throw err;
                if(data.exp < Date.now() / 1000) {
                    res.redirect('/worker/');
                }
                res.locals.loggedInUser = data.username;
                if (!req.session.worker) {
                    req.session.worker = {};
                    
                }
                if (!req.session.worker.basket) {
                    req.session.worker.basket = [];
                }
                res.locals.numberOfBasketItems = req.session.worker.basket.length;
                res.locals.logoutpath = '/worker/logout';
                res.locals.loginpath = '/worker';
                if(req.originalUrl == '/worker'){res.redirect('/worker/menu')}
                next()
            });
            
        }else{
            res.locals.loggedInUser = false;
            res.locals.loginpath = '/worker';
            res.redirect('/worker')
        }
    }
    );


worker_routes.get('/menu', menuController.getMenu);
worker_routes.get('/menu/:category', menuController.getOneCategory);
worker_routes.get('/orders_history', ordersHistoryController.getOrdersHistory);
worker_routes.get('/tables', tablesController.getTables);
worker_routes.post('/setorderstatus', tablesController.updateOrderStatus);

worker_routes.get('/basket', basketController.getBasket);
worker_routes.post('/basket/submit', orderWorkerController.selectedTableCheck ,orderWorkerController.submitOrder);
worker_routes.post('/basket/clear', basketController.clearBasket);
worker_routes.post('/basket/add', basketController.addToBasket);

worker_routes.get("/tables/select/:tableid", orderWorkerController.selectTableforOrder);
worker_routes.get('/tables/order/:id', tablesController.orderOfTable);
worker_routes.get('/tables/:sector',tablesController.getOneLocation);
worker_routes.get('/logout', worker_controller.doLogout);
export default worker_routes;

