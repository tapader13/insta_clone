import express from 'express';
import { authenticateToken } from './../middlewares/tokenVerify.js';
import { upload } from './../middlewares/multer.js';
import {
  addComment,
  bookmarkPost,
  createPost,
  deletePost,
  getAllBookmarks,
  getAllPosts,
  getCommentsOfPost,
  getUserPosts,
  likeDislikePost,
  updatePost,
} from '../controllers/postController.js';

const router = express.Router();
router
  .route('/addpost')
  .post(authenticateToken, upload.single('image'), createPost);
router.route('/all').get(authenticateToken, getAllPosts);
router.route('/allposts/:id').get(authenticateToken, getUserPosts);
router.route('/likedislike/:id').get(authenticateToken, likeDislikePost);
router.route('/comment/:id').post(authenticateToken, addComment);
router.route('/comment/all/:id').get(authenticateToken, getCommentsOfPost);
router.route('/delete/:id').delete(authenticateToken, deletePost);
router.route('/bookmark/:id').get(authenticateToken, bookmarkPost);
router.route('/post/edit/:id').post(authenticateToken, updatePost);
router.get('/allbookmarks/:id', authenticateToken, getAllBookmarks);

export default router;
