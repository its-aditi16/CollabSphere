// const { OpenAI } = require('openai');
// require('dotenv').config();

const openai = { chat: { completions: { create: async () => ({ choices: [{ message: { content: "{}" } }] }) } } }; // Mock for debug

/**
 * Sends a query to the LLM.
 * @param {Array} messages 
 * @returns {Promise<string>}
 */
const queryLLM = async (messages) => {
  try {
    // Check if API key is missing
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-placeholder-key') {
      return "I'm sorry, I cannot process your request because the AI API key is not configured. Please add OPENAI_API_KEY to the server/.env file.";
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or gpt-4
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('LLM API Error:', error.message);
    return `Error: ${error.message}. Please check your API configuration.`;
  }
};

module.exports = { queryLLM };
