import controllers from '@controllers/auth';
import express from 'express';
const router = express.Router();

import multer from 'multer';

const upload = multer({
  limits: {
    fileSize: 5000000, // 5MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  },
});

// routes
router.post('/login', controllers.login);
router.post('/register', upload.single('avatar'), controllers.register);
router.post(
  '/become-mentor',
  upload.single('avatar'),
  controllers.becomeMentor,
);

export default router;
