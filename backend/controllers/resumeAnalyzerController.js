import pdf from "pdf-parse/lib/pdf-parse.js";
import openai from "../aiApi/openAiApi.js";

export const analyzeResume = async (req, res) => {
    try {
        if(!req.file || !req.file.buffer) {
            return res.status(400).json({error: "please upload a PDF file."});
        }

        const data = await pdf(req.file.buffer);
        const resumeText = data.text.trim();

        if(!resumeText) {
            return res.status(400).json({error: "cloud not extract text from PDF."});
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [ 
                {role: "system", content: "You are a professional career advisor. Analyze the following resume and give bullet-point feedback for improvement."},
                {role: "user", content: resumeText},
            ]
        });

        if(completion.choices && completion.choices.length > 0) {
            const feedback = completion.choices[0].message.content;
            return res.status(200).json({feedback});
        } else {
            return res.status(500).json({error: "Failed to generate feedback."});
        }

    } catch (error) {
        console.error("Error analyzing resume:", error);
        return res.status(500).json({error: "Internal server error."});
    }
}