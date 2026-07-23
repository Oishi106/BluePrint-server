import express from 'express';
import {
  createPortfolio,
  getPortfolioById,
  updatePortfolio,
  generatePortfolioContent,
  getPortfolioBySlug,
  publishPortfolio,
} from '../controllers/portfolioController.js';

const router = express.Router();

router.post('/generate', generatePortfolioContent);            
router.get('/slug/:slug', getPortfolioBySlug);       
router.post('/', createPortfolio);
router.get('/:id', getPortfolioById);
router.patch('/:id', updatePortfolio);
router.patch('/:id/publish', publishPortfolio);

export default router;