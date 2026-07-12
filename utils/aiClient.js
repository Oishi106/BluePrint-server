import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

function buildPrompt(data) {
  const skillsStr = data.skills?.length ? data.skills.join(', ') : 'various tools';
  const projectsStr = (data.projects || [])
    .map((p, i) => `${i + 1}. ${p.name || 'Untitled'} — ${p.description || 'no description given'} (tech: ${p.tech || 'not specified'})`)
    .join('\n');

  return `You are writing portfolio website copy for a real person. Use the facts given — do not invent employers, metrics, or claims not implied by the input.

Person:
- Name: ${data.name}
- Role: ${data.role}
- Bio (their own words): ${data.bio || 'not provided'}
- Skills: ${skillsStr}
- Projects:
${projectsStr || 'none listed'}

Return ONLY valid JSON (no markdown fences, no commentary) matching exactly this shape:
{
  "tagline": "a punchy one-line tagline, under 12 words",
  "heroText": "a 1-2 sentence hero introduction, first person, warm but professional",
  "aboutMe": "a 3-4 sentence about-me paragraph expanding on their bio and skills",
  "skillsDescription": "a 1-sentence summary of their skill set",
  "projectDescriptions": [
    { "title": "project name", "description": "2-3 sentence description grounded in what was given", "techStack": ["tech1","tech2"], "link": "the link if provided, else empty string" }
  ]
}

The projectDescriptions array must have exactly one entry per project listed above, in the same order.`;
}

export async function generateContentWithAI(data) {
  const prompt = buildPrompt(data);
  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();

  // Gemini sometimes wraps JSON in ```json fences despite instructions — strip them.
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error('AI returned invalid JSON: ' + cleaned.slice(0, 200));
  }

  // Basic shape safety so a bad AI response can't crash the client.
  return {
    tagline: parsed.tagline || '',
    heroText: parsed.heroText || '',
    aboutMe: parsed.aboutMe || '',
    skillsDescription: parsed.skillsDescription || '',
    projectDescriptions: Array.isArray(parsed.projectDescriptions) ? parsed.projectDescriptions : [],
  };
}