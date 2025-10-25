import openai from "../aiApi/openAiApi.js";
import { Filter } from "bad-words";

const breakdownGoal = async (req, res) => {
  const filter = new Filter();

  let { goal } = req.body;

  if (!goal) {
    return res.status(400).json({ error: true, reason: "Please provide a goal" });
  }

  if (filter.isProfane(goal)) {
    goal = filter.clean(goal);
  }

  // making sure the goal is strictly coding related
  try {
    const clarificationResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a strict classifier. 
          Output JSON with fields: "isCoding" (true/false) and "reason" (string).
          Mark isCoding=true ONLY if the goal is about:
          - coding, programming, app/web/software development,
          - AI/ML, DevOps, cloud, data engineering, or learning to code.
          Everything else should be isCoding=false.`,
        },
        {
          role: "user",
          content: `Goal: "${goal}"`,
        },
      ],
    });

    const result = JSON.parse(clarificationResponse.choices[0].message.content);

    if (!result.isCoding) {
      return res.status(400).json({
        error: true,
        reason: result.reason,
      });
    }
  } catch (error) {
    console.error("Error during goal classification:", error);
    return res.status(500).json({ error: true, reason: "Internal server error while classifying goal" });
  }

  // Proceed to break down the coding-related goal
  const systemPrompt = `You are an expert project manager skilled in breaking down complex goals into smaller, manageable tasks. Your task is to help users by providing a clear and structured breakdown of their goals, including estimated timeframes for each task. Ensure that the breakdown is practical and achievable.`;

  const userPrompt = `Break down the following goal into smaller, manageable tasks with estimated timeframes for each task:\n\nGoal: ${goal}\n\nProvide the breakdown in a JSON format with "task" and "timeframe" fields.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const { choices } = response;
    if (!choices || choices.length === 0) {
      throw new Error("No response from OpenAI");
    }

    const breakdown = JSON.parse(choices[0].message.content);
    return res.status(200).json({ error: false, reason:breakdown });
  } catch (error) {
    console.error("Error breaking down goal:", error);
    return res.status(500).json({ error: true, reason: "Internal server error while breaking down goal" });
  }
};

export { breakdownGoal };
