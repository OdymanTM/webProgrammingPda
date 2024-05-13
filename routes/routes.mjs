import express from 'express'
const router = express.Router();


const controller = await import(`../controllers/sample_controller.mjs`);

router.get('/', controller.posts);
router.get('/menu', controller.menuInit);
router.get('/menu/:category', controller.menuCategory);
router.get('/orders_history', controller.ordersHistoryInit);
router.get('/tables', controller.tablesInit);
router.get('/tables/:sector', controller.tablesSector);

export default router;
