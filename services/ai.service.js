/**
 * =====================================================
 * PRIME AI SERVICE
 * =====================================================
 *
 * PURPOSE
 * -------
 * Responsible for communicating with
 * AI providers.
 *
 * Current Provider:
 * - Ollama
 *
 * Future Providers:
 * - OpenAI
 * - Claude
 * - Gemini
 *
 * IMPORTANT
 * ---------
 * All AI requests should go through
 * this file.
 *
 * This keeps the rest of the application
 * independent from any specific AI
 * provider.
 *
 * =====================================================
 */

import { AI_CONFIG } from "../config/ai.config.js";

/**
 * =====================================================
 * GENERATE AI RESPONSE
 * =====================================================
 *
 * Sends a prompt to the configured
 * AI provider and returns the response.
 *
 * Example:
 *
 * const reply = await generateResponse(
 *   "Explain JavaScript promises"
 * );
 *
 * =====================================================
 */

export async function generateResponse(prompt) {
  try {
    /**
     * Send request to Ollama
     */
    const response = await fetch(`${AI_CONFIG.baseUrl}/api/generate`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: AI_CONFIG.model,
        prompt,
        stream: false,
      }),
    });

    /**
     * Handle server errors
     */
    if (!response.ok) {
      throw new Error(`AI request failed with status ${response.status}`);
    }

    /**
     * Parse response
     */
    const data = await response.json();

    /**
     * Return generated text
     */
    return data.response;
  } catch (error) {
    console.error("Prime AI Service Error:", error.message);

    return "Unable to contact AI service.";
  }
}
