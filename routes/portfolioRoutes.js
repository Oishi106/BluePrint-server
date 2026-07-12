import express from 'express';
import { createPortfolio, getPortfolioById, updatePortfolio, generatePortfolioContent } from '../controllers/portfolioController.js';

const router = express.Router();

router.post('/generate', generatePortfolioContent);
router.post('/', createPortfolio);
router.get('/:id', getPortfolioById);
router.patch('/:id', updatePortfolio);

export default router;