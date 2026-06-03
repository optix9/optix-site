import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/generate-quiz", async (req, res) => {

  try {

    const { topic, difficulty, count } = req.body;

    const prompt = `You are a math quiz generator.

Generate ${count} unique multiple-choice questions about ${topic}.

Difficulty: ${difficulty}.

Return ONLY valid JSON.

Requirements:
- Output exactly ${count} items.
- Each item must be an object with keys: "question", "options", "answer".
- "options" must be an array of 4 string values.
- "answer" must exactly match one of the provided options.
- Do not include any explanation, markdown, or extra text outside the JSON array.

Example format:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "answer": "..."
  }
]
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
    });

    const text = chatCompletion.choices[0].message.content;

    res.json(JSON.parse(text));

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to generate quiz"
    });

  }

});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});