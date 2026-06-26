import { Router } from 'express';
import { registrationHandler, emailHandler } from '../controller/auth.controller';

const router = Router();

router.post('/registration', registrationHandler);
router.get('/api/auth/verify-email', emailHandler);
router.get('/check', (req, res)=>{
    res.json({status: "checked router working"});
})

export default router;
