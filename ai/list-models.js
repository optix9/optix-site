import "dotenv/config";

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
);

const data = await res.json();

for (const model of data.models ?? []) {
  const methods = model.supportedGenerationMethods?.join(", ") ?? "";
  if (methods.includes("generateContent")) {
    console.log(model.name);
  }
}