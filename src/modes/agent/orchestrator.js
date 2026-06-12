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
 * - Prepare agent context
 * - Initialize tools
 * - Initialize action tracking
 * - Coordinate future AI execution
 *
 * Think of it as:
 *
 * User Goal
 *      ↓
 * Orchestrator
 *      ↓
 * Agent
 *      ↓
 * Tools
 *      ↓
 * Approval
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

/**
 * =====================================================
 * RUN AGENT MODE
 * =====================================================
 *
 * Entry point for Agent Mode.
 *
 * =====================================================
 */
export async function runAgentMode() {
  console.log("");

  console.log(chalk.bold.cyan("🤖 Agent Mode"));

  console.log("");

  /**
   * Ask user for goal.
   */
  const goal = await text({
    message: "What would you like the agent to do?",

    placeholder: "Build a React portfolio website",
  });

  /**
   * User cancelled.
   */
  if (isCancel(goal) || !goal?.trim()) {
    console.log("");

    console.log(chalk.dim("Agent mode cancelled."));

    console.log("");

    return;
  }

  /**
   * ===================================================
   * AGENT INITIALIZATION
   * ===================================================
   */

  const config = createAgentConfig();

  const tracker = new ActionTracker();

  const executor = new ToolExecutor(tracker, config);

  const tools = createAgentTools(executor);

  /**
   * Context Object
   *
   * Will be expanded later.
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
   * NEXT PHASE
   * ===================================================
   *
   * Tomorrow:
   *
   * - Connect AI SDK
   * - Connect Ollama
   * - Tool Calling
   * - Multi-Step Reasoning
   * - Approval Workflow
   *
   * ===================================================
   */
  console.log(chalk.cyan("Agent reasoning system coming next..."));

  console.log("");

  /**
   * Temporary Approval Test
   *
   * Remove later.
   */
  await runApprovalFlow(tracker);

  return agentContext;
}
