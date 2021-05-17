import routerx from 'express-promise-router';
import articleController from '../controllers/ArticleController';
import auth from '../middlewares/auth';

const router=routerx();

router.post('/add',auth.verifyWarehouseManager,articleController.add);
router.get('/query',auth.verifyWarehouseManager,articleController.query);
router.get('/queryBarCode',auth.verifyUser,articleController.queryBarCode);
router.get('/list',auth.verifyWarehouseManager,articleController.list);
router.put('/update',auth.verifyWarehouseManager,articleController.update);
router.delete('/removeArticles',auth.verifyWarehouseManager,articleController.removeArticles);
router.put('/activate',auth.verifyWarehouseManager,articleController.activate);
router.put('/deactivate',auth.verifyWarehouseManager,articleController.deactivate);

export default router;