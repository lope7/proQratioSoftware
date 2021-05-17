import routerx from 'express-promise-router';
import categorieRouter from './categorie';
import articleRouter from './article';
import userRouter from './user';
import personRouter from './person';
import orderRouter from './order';
import saleRouter from './sale';
import loanRouter from './loan';
import bankRouter from './bank';
import meetingRouter from './meeting';

const router=routerx();

router.use('/categorie',categorieRouter);
router.use('/article', articleRouter);
router.use('/user', userRouter);
router.use('/person',personRouter);
router.use('/order',orderRouter);
router.use('/sale',saleRouter);
router.use('/bank',bankRouter);
router.use('/loan',loanRouter);
router.use('/meeting',meetingRouter);

export default router;