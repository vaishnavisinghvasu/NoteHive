const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const generateTrivia = async (req, res) => {
  try {
    const { topic, difficulty, numQuestions } = req.body;

    if (!topic || !difficulty || !numQuestions) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate ${numQuestions} unique multiple-choice quiz questions on the topic of ${topic} at ${difficulty} difficulty level.
    The questions should be different each time and should vary in phrasing. 
    Ensure diversity in the questions and options.

    Format the response as a *pure JSON array* without any markdown or code block formatting. Example:
    [
      { "question": "What is a REST API?", "options": ["A", "B", "C", "D"], "answer": "A" }
    ]`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();

    console.log("Raw API Response:", textResponse); // Debugging

    // ✅ *Fix: Remove unwanted markdown from JSON*
    const cleanedJSON = textResponse.replace(/json|/g, "").trim();

    try {
      const quizData = JSON.parse(cleanedJSON);
      res.json({ quizzes: quizData });
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      res.status(500).json({ error: "Invalid AI response format" });
    }

  } catch (error) {
    console.error("Trivia Generation Error:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
};

module.exports = { generateTrivia };
