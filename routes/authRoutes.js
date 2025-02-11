import express from 'express';
import { registerController,loginController, testController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authmiddleware.js';

const router = express.Router();//

// REGISTER || METHOD POST
router.post('/register', registerController);

// LOGIN || METHOD POST
router.post('/login', loginController);

//test router
router.get('/test', requireSignIn, isAdmin, testController);



export default router;
