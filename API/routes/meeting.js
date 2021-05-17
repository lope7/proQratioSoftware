import routerx from 'express-promise-router';
import meetingController from '../controllers/MeetingController';
import auth from '../middlewares/auth';

const router=routerx();

router.post('/add',auth.verifyRRHH,meetingController.add);
router.get('/query',auth.verifyRRHH,meetingController.query);
router.get('/list',auth.verifyRRHH,meetingController.list);
router.put('/update',auth.verifyRRHH,meetingController.update);
router.delete('/removeMeetings',auth.verifyRRHH,meetingController.removeMeetings);
router.put('/activate',auth.verifyRRHH,meetingController.activate);
router.put('/deactivate',auth.verifyRRHH,meetingController.deactivate);

export default router;