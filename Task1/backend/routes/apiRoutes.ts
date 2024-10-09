import { Router } from 'express';
import { uploadFile } from '../controllers/fileController';
import { getTransactions } from '../controllers/transactionController';
import upload from '../middlewares/uploadMiddleware';

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/transactions', getTransactions);

export default router;
