/**
 * =====================================================
 * PRIME AI - AGENT ORCHESTRATOR
 * =====================================================
 *
 * PURPOSE
 * -------
 * The orchestrator acts as the brain
 * of Agent Mode.
 *
 * Responsibilities:
 *
 * - Accept user goals
 * - Initialize agent systems
 * - Load tools
 * - Connect AI provider
 * - Read project files
 * - Coordinate future workflows
 *
 * =====================================================
 */

import chalk from "chalk";

import { text, isCancel } from "@clack/prompts";

import { createAgentConfig } from "./agent.config.js";

import { ActionTracker } from "./action-tracker.js";

import { ToolExecutor } from "./tool-executor.js";

import { createAgentTools } from "./agent-tools.js";

import { runApprovalFlow } from "./approval-flow.js";

import { generateResponse } from "../../../services/ai.service.js";

/**
 * =====================================================
 * EXTRACT FILE NAME
 * =====================================================
 *
 * Detects file references inside
 * user requests.
 *
 * Examples:
 *
 * explain index.js
 * review package.json
 * tell me about app.jsx
 *
 * =====================================================
 */
function extractFileName(goal) {
  const match = goal.match(/\b[\w.-]+\.(js|jsx|ts|tsx|json|md|css|html)\b/i);

  return match?.[0] ?? null;
}

/**
 * =====================================================
 * RUN AGENT MODE
 * =====================================================
 */

export async function runAgentMode() {
  console.log("");

  console.log(chalk.bold.cyan("🤖 Agent Mode"));

  console.log("");

  /**
   * Ask user for goal
   */
  const goal = await text({
    message: "What would you like the agent to do?",

    placeholder: "Build a React portfolio website",
  });

  /**
   * User cancelled
   */
  if (isCancel(goal) || !goal?.trim()) {
    console.log("");

    console.log(chalk.dim("Agent mode cancelled."));

    console.log("");

    return;
  }

  /**
   * ===================================================
   * INITIALIZE AGENT SYSTEMS
   * ===================================================
   */

  const config = createAgentConfig();

  const tracker = new ActionTracker();

  const executor = new ToolExecutor(tracker, config);

  const tools = createAgentTools(executor);

  /**
   * Agent Context
   */
  const agentContext = {
    goal: goal.trim(),

    config,

    tracker,

    executor,

    tools,

    createdAt: new Date(),
  };

  console.log("");

  console.log(chalk.green("✓ Goal received"));

  console.log("");

  console.log(chalk.white("Goal:"));

  console.log(chalk.dim(agentContext.goal));

  console.log("");

  console.log(chalk.green("✓ Agent initialized"));

  console.log(chalk.green("✓ Action tracker ready"));

  console.log(chalk.green("✓ Tool executor ready"));

  console.log(chalk.green("✓ Agent tools loaded"));

  console.log("");

  /**
   * ===================================================
   * AI REASONING
   * ===================================================
   */

  console.log(chalk.cyan("Thinking..."));

  console.log("");

  try {
    /**
     * Default Prompt
     */
    let prompt = goal.trim();

    /**
     * Detect file reference
     */
    const fileName = extractFileName(goal);

    /**
     * File-aware mode
     */
    if (fileName) {
      console.log(chalk.cyan(`Reading file: ${fileName}`));

      console.log("");

      try {
        /**
         * Read file contents
         */
        const fileContent = await executor.readFile(fileName);

        /**
         * Debug Information
         *
         * Remove later once verified.
         */
        console.log(chalk.yellow(`File Length: ${fileContent.length}`));

        console.log("");

        console.log(chalk.dim(fileContent.slice(0, 500)));

        console.log("");

        /**
         * Build AI prompt using
         * actual file contents.
         */
        prompt = `
You are a senior software engineer.

The user asked:

"${goal}"

Below is the actual file content.

========================================
${fileContent}
========================================

Explain:

1. What this file does
2. Important imports
3. Important functions
4. Key logic
5. How the file fits into the project
6. Potential improvements

Use beginner-friendly language.
`;
      } catch (fileError) {
        console.log("");

        console.log(chalk.red(`FILE READ ERROR: ${fileError.message}`));

        console.log("");

        prompt = `
The user asked about:

"${fileName}"

However the file could not be found.

Respond that the file was not found.
`;
      }
    }

    /**
     * Send prompt to AI
     */
    const response = await generateResponse(prompt);

    if (response?.trim()) {
      console.log(chalk.white(response));

      console.log("");
    }
  } catch (error) {
    console.log(chalk.red("Failed to generate AI response."));

    console.log(chalk.dim(error.message));

    console.log("");

    return;
  }

  /**
   * ===================================================
   * APPROVAL FLOW
   * ===================================================
   *
   * Currently there are no
   * generated mutations yet.
   *
   * This remains here because
   * future ToolLoopAgent work
   * will generate actions that
   * require approval.
   *
   * ===================================================
   */

  const approved = await runApprovalFlow(tracker);

  if (!approved) {
    console.log("");

    console.log(chalk.dim("No approved actions."));

    console.log("");

    return agentContext;
  }

  /**
   * Future:
   *
   * executor.applyApprovedFromTracker()
   */

  console.log(chalk.green("✓ Approved actions detected"));

  console.log("");

  return agentContext;
}
