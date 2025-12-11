import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  // Retrieve the key
  let apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error(
      "API_KEY environment variable is missing. Please set VITE_API_KEY in your .env file."
    );
  }

  // Sanitize: Remove extra whitespace and surrounding quotes if the build tool injected them
  apiKey = apiKey.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");

  return new GoogleGenAI({ apiKey });
};

/**
 * Replaces placeholders in the format {variableName} with values from the context.
 */
export const interpolatePrompt = (
  template: string,
  context: Record<string, string>
): string => {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return context[key] || `[MISSING: ${key}]`;
  });
};

/**
 * Executes a single prompt against Gemini.
 */
export const generateStepContent = async (
  prompt: string,
  systemInstruction?: string
): Promise<string> => {
  try {
    const ai = getClient();

    // Using gemini-2.5-flash for speed and efficiency in chaining
    const response = await ai.models.generateContent({
      model: "gemma-3-27b-it",
      contents: prompt,
      // config: {
      //   systemInstruction:
      //     systemInstruction ||
      //     "You are a helpful AI assistant used in a prompt chain.",
      //   temperature: 0.7,
      // },
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
