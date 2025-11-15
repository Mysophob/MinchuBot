import OpenAI from "openai";

const openaiApiKey = process.env.CHAT_GPT_TOKEN;

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

// Define your system prompt here
const systemPromptBase = `You are a helpful assistant in a Discord server. 
Your responses should be friendly, concise, and informative. 
If you're not sure about something, it's okay to say so.
Avoid any inappropriate or offensive content.
If someone asks why you cannot read past messages, tell them its way too expensive.`;

let personalityPrompt = `You are very friendly and understand Japanese and English. Answer in the language that you are spoken to.`;

export async function askAi(query: string): Promise<string> {
  let reply = "";
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPromptBase + personalityPrompt },
        { role: "user", content: query },
      ],
      max_tokens: 150,
    });

    reply = completion.choices[0].message.content || "No response";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    reply = "Sorry, I encountered an error while processing your request.";
  }
  return reply;
}

export async function setPersonality(newPersonality: string): Promise<void> {
  personalityPrompt = newPersonality;
}
