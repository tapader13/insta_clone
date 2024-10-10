import express from 'express';
import { authenticateToken } from './../middlewares/tokenVerify.js';
import { getMessages, sendMessage } from '../controllers/messageController.js';

const router = express.Router();
router.route('/send/:id').post(authenticateToken, sendMessage);
router.route('/all/:id').get(authenticateToken, getMessages);

export default router;
