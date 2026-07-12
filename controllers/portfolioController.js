import asyncHandler from '../utils/asyncHandler.js';
import Portfolio from '../models/Portfolio.js';
import { generateContentWithAI } from '../utils/aiClient.js';

// POST /api/portfolio  — save a new draft (called after client generates content)
export const createPortfolio = asyncHandler(async (req, res) => {
  const { data, content, mode, selectedTemplate, layoutJson } = req.body;

  if (!data || !data.name || !data.role) {
    res.status(400);
    throw new Error('data.name and data.role are required');
  }

  const portfolio = await Portfolio.create({
    data,
    content,
    mode,
    selectedTemplate: selectedTemplate || null,
    layoutJson: layoutJson || null,
  });

  res.status(201).json(portfolio);
});

// GET /api/portfolio/:id — fetch one (used by client preview/edit pages)
export const getPortfolioById = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }
  res.json(portfolio);
});

// PATCH /api/portfolio/:id — update content/mode/template/layout (edit, regenerate, choose design)
export const updatePortfolio = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  const { data, content, mode, selectedTemplate, layoutJson } = req.body;
  if (data) portfolio.data = { ...portfolio.data.toObject(), ...data };
  if (content) portfolio.content = { ...portfolio.content.toObject(), ...content };
  if (mode) portfolio.mode = mode;
  if (selectedTemplate !== undefined) portfolio.selectedTemplate = selectedTemplate;
  if (layoutJson !== undefined) portfolio.layoutJson = layoutJson;

  await portfolio.save();
  res.json(portfolio);
});




// POST /api/portfolio/generate — real AI content generation (replaces client mockAI)
export const generatePortfolioContent = asyncHandler(async (req, res) => {
  const { data } = req.body;

  if (!data || !data.name || !data.role) {
    res.status(400);
    throw new Error('data.name and data.role are required');
  }

  const content = await generateContentWithAI(data);
  res.json({ content });
});