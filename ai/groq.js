import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function run() {

  const prompt =
    process.argv.slice(2).join(" ") ||
    `
Generate 3 Grade 12 olympiad calculus questions.

Return ONLY valid JSON.

Format:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "answer": "..."
  }
]
`;

  console.log("Prompt:", prompt);

  try {

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    console.log(chatCompletion.choices[0].message.content);

  } catch (error) {
    console.error(error);
  }
}

run();