/**
 * =====================================================
 * PRIME AI CONFIGURATION
 * =====================================================
 *
 * PURPOSE
 * -------
 * Central location for all AI settings.
 *
 * Benefits:
 *
 * - Change configuration without
 *   modifying application code
 *
 * - Switch AI providers easily
 *
 * - Keep environment-specific values
 *   outside source code
 *
 * Future Providers:
 *
 * - Ollama
 * - OpenAI
 * - Claude
 * - Gemini
 *
 * =====================================================
 */

/**
 * =====================================================
 * ENVIRONMENT VARIABLES
 * =====================================================
 *
 * Values are loaded from:
 *
 * .env
 *
 * Example:
 *
 * AI_PROVIDER=ollama
 * OLLAMA_MODEL=qwen2.5:1.5b
 * OLLAMA_BASE_URL=http://localhost:11434
 *
 * =====================================================
 */

export const AI_CONFIG = {
  /**
   * AI Provider
   *
   * Controls which AI backend
   * Prime AI should use.
   */
  provider: process.env.AI_PROVIDER || "ollama",

  /**
   * AI Model
   *
   * Current:
   * qwen2.5:1.5b
   *
   * Alternatives:
   * llama3:8b
   * qwen2.5:0.5b
   */
  model: process.env.OLLAMA_MODEL || "qwen2.5:1.5b",

  /**
   * Ollama Server URL
   *
   * Default Ollama endpoint.
   */
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
};

/**
 * =====================================================
 * CONFIGURATION VALIDATION
 * =====================================================
 *
 * Basic startup checks help catch
 * configuration issues early.
 *
 * =====================================================
 */

if (!AI_CONFIG.provider) {
  throw new Error("AI_PROVIDER is not configured.");
}

if (!AI_CONFIG.model) {
  throw new Error("OLLAMA_MODEL is not configured.");
}

if (!AI_CONFIG.baseUrl) {
  throw new Error("OLLAMA_BASE_URL is not configured.");
}
