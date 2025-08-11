import openai from "../aiApi/openAiApi.js";

export const careerChatbot = async (req, res) => {
    try{
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({ error: "Prompt is required and must be a string" });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt}],
        });

        res.status(200).json({
            reply: completion.choices[0].message.content,
        });
    } catch (error) {
        console.error("Error occurred while processing AI request:", error);
        res.status(500).json({
            error: "An error occurred while processing your request.",
        });
    }
};