/**
 * =====================================================
 * PRIME AI SERVICE
 * =====================================================
 *
 * PURPOSE
 * -------
 * Central AI communication layer.
 *
 * All AI requests pass through here.
 *
 * Supported:
 * - Ollama
 *
 * Planned:
 * - OpenAI
 * - Claude
 * - Gemini
 *
 * =====================================================
 */

import chalk from "chalk";
import { AI_CONFIG } from "../config/ai.config.js";

/**
 * =====================================================
 * SYSTEM PROMPT
 * =====================================================
 */

const SYSTEM_PROMPT = `
You are Prime AI.

You are a senior software engineer and AI coding assistant.

Rules:

- Be accurate.
- Be concise.
- Never invent file contents.
- Never claim a file exists if it was not provided.
- Prefer tool usage when available.
- If modifying code, return only the final code.
`;

/**
 * =====================================================
 * VALIDATE CONFIG
 * =====================================================
 */

function validateConfig() {
  if (!AI_CONFIG.provider) {
    throw new Error("Missing AI provider.");
  }

  if (!AI_CONFIG.baseUrl) {
    throw new Error("Missing AI base URL.");
  }

  if (!AI_CONFIG.model) {
    throw new Error("Missing AI model.");
  }
}

/**
 * =====================================================
 * OLLAMA REQUEST
 * =====================================================
 */

async function callOllama(prompt) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {
    console.log("");
    console.log(chalk.cyan("🤖 Sending request to Ollama..."));

    const started = Date.now();

    const response = await fetch(`${AI_CONFIG.baseUrl}/api/generate`, {
      method: "POST",

      signal: controller.signal,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: AI_CONFIG.model,

        stream: false,

        options: {
          temperature: 0.2,
        },

        prompt: `
${SYSTEM_PROMPT}

${prompt}
`,
      }),
    });

    const elapsed = Date.now() - started;

    console.log(
      chalk.green(`✓ Request completed (${elapsed.toLocaleString()}ms)`),
    );

    if (!response.ok) {
      throw new Error(
        `Ollama request failed (${response.status} ${response.statusText})`,
      );
    }

    console.log(chalk.cyan("⏳ Waiting for JSON response..."));

    const data = await response.json();

    console.log(chalk.green("✓ JSON received"));

    const output = data?.response?.trim();

    if (!output) {
      throw new Error("Ollama returned an empty response.");
    }

    console.log(chalk.green("✓ AI response generated"));

    return output;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * =====================================================
 * GENERATE RESPONSE
 * =====================================================
 */

export async function generateResponse(prompt) {
  try {
    validateConfig();

    switch (AI_CONFIG.provider.toLowerCase()) {
      case "ollama":
        return await callOllama(prompt);

      default:
        throw new Error(`Unsupported AI provider: ${AI_CONFIG.provider}`);
    }
  } catch (error) {
    console.log("");

    console.log(chalk.red("========== AI ERROR =========="));

    console.log(chalk.red(error?.message ?? String(error)));

    console.log(chalk.red("=============================="));

    console.log("");

    return `AI Error: ${error?.message ?? "Unknown error"}`;
  }
}
