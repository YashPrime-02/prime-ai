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
/**
 * =====================================================
 * GENERATE AI RESPONSE
 * =====================================================
 *
 * Sends a prompt to the configured
 * AI provider and returns the response.
 *
 * =====================================================
 */

export async function generateResponse(prompt) {
  try {
    /**
     * Debug Information
     */
    // console.log("\n========== AI DEBUG ==========");

    // console.log("Provider :", AI_CONFIG.provider);

    // console.log("Model    :", AI_CONFIG.model);

    // console.log("Base URL :", AI_CONFIG.baseUrl);

    // console.log("Node     :", process.version);

    // console.log("==============================\n");

    /**
     * Create Request Timeout
     *
     * Prevents hanging forever if
     * Ollama does not respond.
     */
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);

    console.log("Sending request to Ollama...");

    /**
     * Send Request
     */
    const response = await fetch(`${AI_CONFIG.baseUrl}/api/generate`, {
      method: "POST",

      signal: controller.signal,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: AI_CONFIG.model,
        prompt,
        stream: false,
      }),
    });

    clearTimeout(timeout);

    console.log("✓ Request completed");

    /**
     * Handle HTTP Errors
     */
    if (!response.ok) {
      throw new Error(`AI request failed with status ${response.status}`);
    }

    console.log("Waiting for JSON response...");

    /**
     * Parse Response
     */
    const data = await response.json();

    console.log("✓ JSON received");

    /**
     * Basic Response Validation
     */
    if (!data.response) {
      throw new Error("Ollama returned an empty response.");
    }

    console.log("✓ AI response generated");

    /**
     * Return Generated Text
     */
    return data.response;
  } catch (error) {
    console.log("");

    console.error("========== AI ERROR ==========");

    console.error(error);

    console.error("==============================");

    console.log("");

    return "Unable to contact AI service.";
  }
}
