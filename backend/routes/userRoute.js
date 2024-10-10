import express from 'express';
import { authenticateToken } from './../middlewares/tokenVerify.js';
import { upload } from './../middlewares/multer.js';
import {
  followUnfollow,
  getSuggestedUsers,
  getUserProfile,
  login,
  logout,
  register,
  updateUserProfile,
} from '../controllers/userController.js';
const router = express.Router();
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/profile/:id').get(authenticateToken, getUserProfile);
router.route('/suggestuser').get(authenticateToken, getSuggestedUsers);
router
  .route('/profile/edit')
  .post(authenticateToken, upload.single('profilePic'), updateUserProfile);
router.route('/followunfollow/:id').post(authenticateToken, followUnfollow);

export default router;
