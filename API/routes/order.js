import routerx from 'express-promise-router';
import orderController from '../controllers/OrderController';
import auth from '../middlewares/auth';

const router=routerx();

router.post('/add',auth.verifyWarehouseManager,orderController.add);
router.get('/query',auth.verifyWarehouseManager,orderController.query);
router.get('/list',auth.verifyWarehouseManager,orderController.list);
router.get('/queryDate',auth.verifyUser,orderController.queryDate);
router.put('/activate',auth.verifyWarehouseManager,orderController.activate);
router.put('/deactivate',auth.verifyWarehouseManager,orderController.deactivate);
router.delete('/removeOrders',auth.verifyWarehouseManager,orderController.removeOrders);

export default router;