import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, hours } = req.body;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Create a ${hours}-hour study plan for ${subject}. Make it simple and structured.`,
        },
      ],
    });

    res.status(200).json({
      plan: completion.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating plan" });
  }
}
