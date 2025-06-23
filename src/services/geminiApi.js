import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI;
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const generateQuestions = async (topic, difficulty) => {
  const prompt = `You are an expert question setter for accounting exams. Generate 10 multiple-choice questions for the topic "${topic}" at "${difficulty}" level.  
Each question should have:
- A clear, relevant accounting question  
- Four options labeled 'A', 'B', 'C', 'D'
- Mention the correct option at the end  
Respond in strict JSON format like this:

{
  "questions": [
    {
      "question": "Write your question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option C"
    }
  ]
}

Topics: Tally Prime, GST, TDS, Excel, Accountancy / Journal Entries
Difficulty levels: Easy, Medium, Hard`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    console.log(response);

    // const response = await fetch(GEMINI_API_URL, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     contents: [
    //       {
    //         parts: [
    //           {
    //             text: prompt,
    //           },
    //         ],
    //       },
    //     ],
    //   }),
    // });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    // const data = await response.json();
    const generatedText = response.candidates[0].content.parts[0].text;

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);

    console.log(jsonMatch);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const questionsData = JSON.parse(jsonMatch[0]);
    return questionsData.questions || [];
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

export const generateAllQuestions = async (selectedTopics, difficulty) => {
  const allQuestions = [];

  for (const topic of selectedTopics) {
    try {
      const questions = await generateQuestions(topic, difficulty);
      // Add topic info to each question and normalize the answer to 'Option X' format
      const topicQuestions = questions.map((q) => {
        // Find the index of the correct answer in the options array
        const answerIndex = q.options.findIndex(
          (opt) => opt.trim() === q.answer.trim()
        );
        // Convert index to 'Option X' format
        const answerLetter =
          answerIndex !== -1
            ? `Option ${String.fromCharCode(65 + answerIndex)}`
            : "";
        return {
          ...q,
          topic: topic,
          answer: answerLetter, // Store as 'Option A', 'Option B', etc.
        };
      });
      allQuestions.push(...topicQuestions);
    } catch (error) {
      console.error(`Error generating questions for ${topic}:`, error);
      // Continue with other topics even if one fails
    }
  }

  return allQuestions;
};
