import routerx from 'express-promise-router';
import personController from '../controllers/PersonController';
import auth from '../middlewares/auth';
const router=routerx();

router.post('/add',auth.verifyUser,personController.add);
router.get('/query',auth.verifyUser,personController.query);
router.get('/list',auth.verifyUser,personController.list);
router.get('/clientList',auth.verifyUser,personController.clientList);
router.get('/providerList',auth.verifyUser,personController.providerList);
router.get('/creditorList',auth.verifyUser,personController.creditorList);
router.get('/employeeList',auth.verifyUser,personController.employeeList);
router.put('/update',auth.verifyUser,personController.update);
router.put('/activate',auth.verifyUser,personController.activate);
router.put('/deactivate',auth.verifyUser,personController.deactivate);
router.delete('/removeAll',auth.verifyUser,personController.removeAll);

export default router;