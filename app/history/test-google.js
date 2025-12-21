require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModels() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    console.log("❌ No API Key found in .env.local");
    return;
  }
  console.log("🔑 Using Key:", key.substring(0, 10) + "...");

  const genAI = new GoogleGenerativeAI(key);

  // Try the standard model first
  try {
    console.log("Testing gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, are you there?");
    console.log("✅ SUCCESS! gemini-1.5-flash is working.");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.log("❌ gemini-1.5-flash Failed:", error.message.split('[')[0]); // Clean error

    // If that failed, try the older reliable one
    try {
        console.log("\nTesting gemini-pro (Backup)...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result2 = await model2.generateContent("Hello?");
        console.log("✅ SUCCESS! gemini-pro is working.");
    } catch (e2) {
        console.log("❌ gemini-pro Failed:", e2.message.split('[')[0]);
    }
  }
}

checkModels();