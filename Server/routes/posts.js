import express from 'express';
import { getFeedPosts, getUserPosts, LikePost } from '../controller/posts.js';
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();


/*READ*/

router.get("/", verifyToken, getFeedPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);



/*UPDATE*/

router.patch('/:id/like', verifyToken, LikePost);



export default router;

