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

// GET /api/portfolio/slug/:slug — public fetch, no auth, only returns published portfolios
export const getPortfolioBySlug = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ slug: req.params.slug, published: true });
  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found or not published');
  }
  res.json(portfolio);
});

// PATCH /api/portfolio/:id/publish — set slug + published:true in one call
export const publishPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  let slug = req.body.slug;
  // ensure uniqueness — if taken, append a random suffix
  const clash = await Portfolio.findOne({ slug, _id: { $ne: portfolio._id } });
  if (clash) slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

  const { mode, selectedTemplate, layoutJson } = req.body;
  if (mode) portfolio.mode = mode;
  if (selectedTemplate !== undefined) portfolio.selectedTemplate = selectedTemplate;
  if (layoutJson !== undefined) portfolio.layoutJson = layoutJson;

  portfolio.slug = slug;
  portfolio.published = true;
  await portfolio.save();

  res.json({
    slug: portfolio.slug,
    published: portfolio.published,
    mode: portfolio.mode,
    selectedTemplate: portfolio.selectedTemplate,
  });
});