import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { subject, hours } = req.body;

    if (!subject || !hours) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Create a short ${hours}-hour study plan for ${subject}. 
          Keep it concise and structured in bullet points.`,
        },
      ],
      max_tokens: 200,   // 🔥 makes it faster
      temperature: 0.7,
    });

    res.status(200).json({
      plan: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate plan" });
  }
}
