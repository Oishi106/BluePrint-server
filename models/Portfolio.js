import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    tech: { type: String, default: '' },
    link: { type: String, default: '' },
    image: { type: String, default: '' }, // base64 data URL
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

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
  },
  { _id: false }
);

// --- NEW: optional sections ---
const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    issuer: { type: String, default: '' },
    year: { type: String, default: '' },
    link: { type: String, default: '' },       // credential URL, optional
    image: { type: String, default: '' },      // base64 certificate image, optional
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    year: { type: String, default: '' },
  },
  { _id: false }
);

const internshipSchema = new mongoose.Schema(
  {
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);
// --- END NEW ---

const statsSchema = new mongoose.Schema(
  {
    projects: { type: String, default: '' },
    satisfaction: { type: String, default: '' },
    years: { type: String, default: '' },
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
    hero: { type: String, default: 'center' },
    about: { type: String, default: 'left-image' },
    projects: { type: String, default: 'grid' },
    skills: { type: String, default: 'tags' },
    order: { type: [String], default: ['hero', 'about', 'skills', 'projects', 'contact'] },
    theme: { type: themeSchema, default: () => ({}) },
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

    data: {
      name: { type: String, required: true, trim: true },
      role: { type: String, default: '' },
      bio: { type: String, default: '' },
      photoUrl: { type: String, default: '' },
      skills: { type: [String], default: [] },
      projects: { type: [projectSchema], default: [] },
      education: { type: [educationSchema], default: [] },
      services: { type: [serviceSchema], default: [] },
      stats: { type: statsSchema, default: () => ({}) },
      email: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      facebook: { type: String, default: '' },

      // NEW: optional per-portfolio sections — empty array = section hidden
      certificates: { type: [certificateSchema], default: [] },
      achievements: { type: [achievementSchema], default: [] },
      internships: { type: [internshipSchema], default: [] },
    },

    content: {
      tagline: { type: String, default: '' },
      heroText: { type: String, default: '' },
      aboutMe: { type: String, default: '' },
      skillsDescription: { type: String, default: '' },
      projectDescriptions: { type: [projectDescriptionSchema], default: [] },
    },

    mode: { type: String, enum: ['template', 'ai-layout'], default: 'template' },
    selectedTemplate: { type: String, default: null }, // 'template-1' | 'template-2' | 'template-3'
    layoutJson: { type: layoutSchema, default: null },

    slug: { type: String, unique: true, sparse: true, index: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Portfolio', portfolioSchema);