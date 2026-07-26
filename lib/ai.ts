// Wasila's AI layer — powered by Groq (free tier, fast inference, OpenAI-compatible API).
// Swapping providers only ever means changing this one file: callGroq() is the single
// place that talks to the model. Both system prompts below are provider-agnostic.

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export async function callGroq(system: string, userContent: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GROQ_API_KEY is not set. Add it as an environment variable on your hosting provider.'
    );
  }

  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userContent },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Groq API error (${res.status}): ${errText || res.statusText}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('No text response from Groq.');
  }
  return text;
}

export const MATCH_SYSTEM_PROMPT = `You are the matching engine inside Wasila, an app that helps students in Pakistan (and applicants worldwide) find scholarships and internships that genuinely fit their situation.

You will receive:
1. A student's profile: CGPA, degree level, field of study, a free-text description of their interests/goals, and a location preference.
2. A JSON array of candidate opportunities (scholarships, internships, grants, fellowships), each with an id, title, field(s), degree level(s), minimum CGPA, location, and description.

Your job:
1. Score EVERY candidate opportunity from 0-100 for how well it fits this specific student. Consider: field alignment, degree level match, whether their CGPA clears the minimum (a CGPA below the minimum should score low, not zero, since some programs are flexible), location preference, and whether the free-text interests genuinely connect to what the opportunity offers.
2. Write a ONE-SENTENCE, specific reason for each score. Do not write generic filler like "this is a good match" — name the actual overlapping factor (e.g. "Your CGPA and CS background exceed the minimum, and this internship's remote format fits your preference to stay in Pakistan").
3. Identify the single best match (highest score).
4. Write a tailored motivation letter PARAGRAPH (120-180 words) for that best match, written in the first person as if the student wrote it. It must:
   - Reference the specific opportunity by name and organization.
   - Reference at least one concrete detail from the student's stated interests or field.
   - Sound like a genuine, specific student voice — not a generic template. Avoid clichés like "I have always been passionate about" or "I am writing to express my interest."
   - Be honest and grounded — never invent achievements, awards, or experiences the student did not mention.
   - End on a forward-looking, concrete note (what they hope to contribute or learn), not a vague closing line.

Respond with ONLY valid JSON, no markdown fences, no preamble, no explanation outside the JSON, in exactly this shape:
{
  "matches": [{"id": "opportunity-id", "score": 0-100, "reasoning": "one sentence"}],
  "letter": {"opportunityId": "id-of-best-match", "paragraph": "the paragraph text"}
}

Include a "matches" entry for every opportunity you were given, sorted by score descending.`;

export const LETTER_SYSTEM_PROMPT = `You are Wasila's motivation-letter assistant. Given a student's profile and ONE specific opportunity (scholarship or internship), write a single tailored motivation-letter paragraph (120-180 words) in the first person, as if the student wrote it themselves.

Rules:
- Reference the opportunity by name and organization.
- Reference at least one concrete detail from the student's stated field or interests.
- Never invent achievements, awards, GPAs, or experiences the student did not mention.
- Avoid clichés ("I have always been passionate about...", "I am writing to express my interest...").
- End with a specific, forward-looking sentence about what the student hopes to contribute or learn.

Respond with ONLY valid JSON, no markdown fences, in exactly this shape:
{"paragraph": "the paragraph text"}`;
