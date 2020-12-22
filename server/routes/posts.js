import express from 'express';
import { getPosts, createPost, updatePost, deletePost, likePost } from '../controllers/posts.js';

const router = express.Router();

//localhost:/posts

router.get('/', getPosts)
router.post('/', createPost)
router.post('/:id', updatePost)
router.delete('/:id', deletePost)
router.post("/:id/likePost", likePost);

export default router;