import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const synthesiseMeeting = async (room) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const proposals = Object.entries(room.proposals || {}).map(([id, p]) => {
    const votes      = Object.values(p.votes      || {}).length;
    const objections = Object.values(p.objections || {}).map(o => `- ${o.text} (by ${o.userName})`).join("\n");
    return `
PROPOSAL: "${p.title}"
Description: ${p.description || "No description"}
Author: ${p.authorName}
Dot-votes: ${votes}
Objections:
${objections || "None"}
    `.trim();
  }).join("\n\n---\n\n");

  const prompt = `
You are a neutral meeting facilitator AI. Analyse the following silent meeting proposals and produce a clear synthesis.

Meeting Topic: ${room.title}
Meeting Goal: ${room.goal || "General discussion"}

PROPOSALS:
${proposals}

Please respond in this EXACT JSON format (no markdown, no backticks):
{
  "consensus": "2-3 sentence summary of what the group appears to agree on based on votes",
  "keyInsights": ["insight 1", "insight 2", "insight 3"],
  "actionItems": [
    { "action": "clear action description", "owner": "person responsible or 'Team'" },
    { "action": "...", "owner": "..." }
  ],
  "risks": ["risk or concern raised 1", "risk or concern raised 2"],
  "recommendation": "One clear recommendation sentence for moving forward"
}
`;

  const result   = await model.generateContent(prompt);
  const text     = result.response.text();
  const cleaned  = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};