import express from 'express';
import {
  getPosts,
  createPost,
  getPost,
  likePost,
  commentPost,
  deletePost,
} from '../controllers/communityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/posts', getPosts);
router.post('/posts', createPost);
router.get('/posts/:id', getPost);
router.post('/posts/:id/like', likePost);
router.post('/posts/:id/comment', commentPost);
router.delete('/posts/:id', deletePost);

export default router;






