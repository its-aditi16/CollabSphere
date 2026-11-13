const { queryLLM } = require('./llmClient');

/**
 * Extracts structured tasks from the provided project context and chat history.
 * @param {Array} messages - Recent chat messages.
 * @param {Object} projectMetadata - Information about the project (name, description, members).
 * @returns {Promise<Object>} - The structured task plan.
 */
const extractTasksFromContext = async (messages, projectMetadata) => {
  const systemPrompt = `
You are an expert Project Manager AI for CollabSphere.
Your goal is to analyze the conversation and extract actionable project tasks.

INPUT CONTEXT:
Project: ${projectMetadata.name}
Description: ${projectMetadata.description}
Team Members: ${JSON.stringify(projectMetadata.members)}

INSTRUCTIONS:
1. Analyze the chat history below for potential tasks.
2. Create clear, concise, and actionable tasks.
3. Assign a priority (low, medium, high) based on urgency/impact.
4. suggest an assignee FROM THE TEAM MEMBERS LIST if clearly implied by context, otherwise leave null. DO NOT invent names.
5. Do NOT invent due dates unless explicitly mentioned.
6. If the scope is too vague, do not create a task for it.
7. Return the result STRICTLY as a JSON object with the following structure:
{
  "tasks": [
    {
      "title": "Short title",
      "description": "Detailed description",
      "priority": "low|medium|high",
      "assignee": "Member Name" (or null),
      "dueDate": "YYYY-MM-DD" (or null)
    }
  ]
}

CHAT HISTORY:
${messages.map(m => `${m.sender}: ${m.content}`).join('\n')}
`;

  const prompt = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Generate a task plan based on our discussion.' }
  ];

  try {
    const response = await queryLLM(prompt);
    
    // Parse JSON from response (handle potential markdown code blocks)
    let jsonString = response;
    if (response.includes('```json')) {
      jsonString = response.split('```json')[1].split('```')[0];
    } else if (response.includes('```')) {
      jsonString = response.split('```')[1].split('```')[0];
    }

    return JSON.parse(jsonString.trim());
  } catch (error) {
    console.error('Error extracting tasks:', error);
    throw new Error('Failed to parse AI response into structured tasks.');
  }
};

module.exports = { extractTasksFromContext };
