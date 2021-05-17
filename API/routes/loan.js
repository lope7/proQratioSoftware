import routerx from 'express-promise-router';
import LoanController from '../controllers/LoanController';
import auth from '../middlewares/auth';

const router=routerx();

router.post('/add',auth.verifyFinanceManager,LoanController.add);
router.get('/query',auth.verifyFinanceManager,LoanController.query);
router.get('/queryBank',auth.verifyFinanceManager,LoanController.queryBank);
router.get('/list',auth.verifyFinanceManager,LoanController.list);
router.put('/update',auth.verifyFinanceManager,LoanController.update);
router.delete('/removeLoans',auth.verifyFinanceManager,LoanController.removeLoans);
router.put('/activate',auth.verifyFinanceManager,LoanController.activate);
router.put('/deactivate',auth.verifyFinanceManager,LoanController.deactivate);

export default router;