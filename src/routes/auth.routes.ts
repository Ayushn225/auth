import { Router } from 'express';
import { 
    registrationHandler, 
    emailHandler, 
    loginHandler, 
    refreshHandler, 
    logoutHandler,
    forgotPasswordHandler,
    resetPasswordHandler
} from '../controller/auth.controller';

const router = Router();

router.post('/registration', registrationHandler);
router.get('/api/auth/verify-email', emailHandler);
router.post('/login', loginHandler);
router.post('/refresh', refreshHandler);
router.post('/logout', logoutHandler);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/reset-password', resetPasswordHandler);

router.get('/check', (req, res)=>{
    res.json({status: "checked router working"});
})

export default router;
