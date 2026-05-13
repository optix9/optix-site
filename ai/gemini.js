import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";
import {GoogleGenerativeAI} from "@google/generative-ai";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

function sanitizeApiKey(key) {
    if (!key) return key;
    return key
        .trim()
        .replace(/^['"]+/, "")
        .replace(/['";]+$/, "")
        .trim();
}

const apiKey = sanitizeApiKey(process.env.API_KEY);
if (!apiKey) {
    console.error("Missing API_KEY in environment. Add it to ai/.env.local or export it before running.");
    process.exitCode = 1;
    throw new Error("API key is not defined.");
}

const genAI = new GoogleGenerativeAI(apiKey);

async function run(){
    const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-pro-latest";
    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = process.argv.slice(2).join(" ") || "Create 3 Hard Math Problems on Grade 10 Algebra.";

    console.log("Model:", modelName);
    console.log("Prompt:", prompt);

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response();
        const text = response.text();
        console.log(text);
    } catch (error) {
        console.error("Gemini API error:", error);
        process.exitCode = 1;
    }
}

run();