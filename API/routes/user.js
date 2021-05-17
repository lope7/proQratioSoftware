import routerx from 'express-promise-router';
import userController from '../controllers/UserController';
import auth from '../middlewares/auth';

const router=routerx();

router.post('/add',auth.verifyAdmin,userController.add);
router.get('/query',auth.verifyAdmin,userController.query);
router.get('/list',auth.verifyAdmin,userController.list);
router.put('/update',auth.verifyAdmin,userController.update);
router.delete('/remove',auth.verifyAdmin,userController.remove);
router.put('/activate',auth.verifyAdmin,userController.activate);
router.put('/deactivate',auth.verifyAdmin,userController.deactivate);
router.post('/login',userController.login);

export default router;