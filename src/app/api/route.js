import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const { messages } = await req.json();
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      // model: "ft:gpt-3.5-turbo-0125:personal:tour-guide:970fYmYV",
      messages,
    });

    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error("Error:", error);
    // Send an error response back to the client
    return JSON.stringify({
      error: true,
      message: error.message,
      status: 400,
    });
  }
}
