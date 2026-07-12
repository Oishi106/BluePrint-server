import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    tech: { type: String, default: '' }, // raw comma-separated input, as in the client
    link: { type: String, default: '' },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, default: '' },
    institution: { type: String, default: '' },
    year: { type: String, default: '' },
  },
  { _id: false }
);

const projectDescriptionSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    link: { type: String, default: '' },
  },
  { _id: false }
);

const themeSchema = new mongoose.Schema(
  {
    mode: { type: String, enum: ['dark', 'light'], default: 'dark' },
    primaryColor: { type: String, default: '#0A1628' },
    accentColor: { type: String, default: '#5EEAD4' },
    font: { type: String, default: 'var(--font-mono)' },
  },
  { _id: false }
);

const layoutSchema = new mongoose.Schema(
  {
    hero: { type: String, enum: ['center', 'left-image', 'right-image', 'full-bleed'], default: 'center' },
    about: { type: String, enum: ['left-image', 'right-image', 'centered-text'], default: 'left-image' },
    projects: { type: String, enum: ['grid', 'masonry', 'carousel'], default: 'grid' },
    skills: { type: String, enum: ['cards', 'bars', 'tags', 'percent'], default: 'tags' },
    theme: { type: themeSchema, default: () => ({}) },
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

    // ---- raw input (mirrors PortfolioContext.state.data) ----
    data: {
      name: { type: String, required: true, trim: true },
      role: { type: String, default: '' },
      bio: { type: String, default: '' },
      photoBase64: { type: String, default: '' }, // "data:image/jpeg;base64,...."
      skills: { type: [String], default: [] },
      projects: { type: [projectSchema], default: [] },
      education: { type: [educationSchema], default: [] },
      email: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },

    // ---- AI-generated content (mirrors state.content) ----
    content: {
      tagline: { type: String, default: '' },
      heroText: { type: String, default: '' },
      aboutMe: { type: String, default: '' },
      skillsDescription: { type: String, default: '' },
      projectDescriptions: { type: [projectDescriptionSchema], default: [] },
    },

    // ---- design choice (mirrors state.mode/selectedTemplate/layoutJson) ----
    mode: { type: String, enum: ['template', 'ai-layout'], default: 'template' },
    selectedTemplate: { type: String, default: null }, // template id, e.g. "developer-green"
    layoutJson: { type: layoutSchema, default: null }, // used when mode === 'ai-layout'

    // ---- publishing ----
    slug: { type: String, unique: true, sparse: true, index: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Portfolio', portfolioSchema);