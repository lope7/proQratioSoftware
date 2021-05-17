import routerx from 'express-promise-router';
import bankController from '../controllers/BankController';
import auth from '../middlewares/auth';

const router=routerx();

router.post('/add',auth.verifyFinanceManager,bankController.add);
router.get('/query',auth.verifyFinanceManager,bankController.query);
router.get('/list',auth.verifyFinanceManager,bankController.list);
router.put('/update',auth.verifyFinanceManager,bankController.update);
router.delete('/removeBanks',auth.verifyFinanceManager,bankController.removeBanks);
router.put('/activate',auth.verifyFinanceManager,bankController.activate);
router.put('/deactivate',auth.verifyFinanceManager,bankController.deactivate);

export default router;