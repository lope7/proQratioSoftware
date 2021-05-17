import routerx from 'express-promise-router';
import categorieController from '../controllers/CategorieController';
import auth from '../middlewares/auth';

const router=routerx();

router.post('/add',auth.verifyWarehouseManager,categorieController.add);
router.get('/query',auth.verifyWarehouseManager,categorieController.query);
router.get('/list',auth.verifyWarehouseManager,categorieController.list);
router.put('/update',auth.verifyWarehouseManager,categorieController.update);
router.put('/activate',auth.verifyWarehouseManager,categorieController.activate);
router.put('/deactivate',auth.verifyWarehouseManager,categorieController.deactivate);
router.delete('/removeCategories',auth.verifyWarehouseManager,categorieController.removeCategories);

export default router;