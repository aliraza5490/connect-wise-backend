import controllers from '@controllers/mentors';
import express from 'express';
const router = express.Router();

// routes
router.get('/list', controllers.list);
router.get('/featured', controllers.featuredList);
router.post('/search', controllers.search);

export default router;
