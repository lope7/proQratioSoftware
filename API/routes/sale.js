import routerx from 'express-promise-router';
import saleController from '../controllers/SaleController';
import auth from '../middlewares/auth';

const router=routerx();

router.post('/add',auth.verifySalesManager,saleController.add);
router.get('/query',auth.verifySalesManager,saleController.query);
router.get('/list',auth.verifySalesManager,saleController.list);
router.get('/queryDate',auth.verifyUser,saleController.queryDate);
router.put('/activate',auth.verifySalesManager,saleController.activate);
router.put('/deactivate',auth.verifySalesManager,saleController.deactivate);
router.delete('/removeSales',auth.verifySalesManager,saleController.removeOrders);

export default router;