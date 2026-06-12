/**
 * =====================================================
 * PRIME AI - CLI MODE
 * =====================================================
 *
 * PURPOSE
 * -------
 * Handles all terminal interactions.
 *
 * Available Sub-Modes:
 *
 * - Agent Mode
 * - Plan Mode
 * - Ask Mode
 *
 * =====================================================
 */

import { select, isCancel } from "@clack/prompts";
import chalk from "chalk";

/**
 * Agent Mode
 */
import { runAgentMode } from "./agent/orchestrator.js";

/**
 * =====================================================
 * RUN CLI MODE
 * =====================================================
 *
 * Once the user enters CLI mode,
 * they can choose which AI workflow
 * they want to use.
 *
 * =====================================================
 */
export async function runCliMode() {
  while (true) {
    /**
     * Display CLI menu
     */
    const mode = await select({
      message: "Choose CLI sub-mode",
      options: [
        {
          value: "agent",
          label: "Agent Mode",
        },
        {
          value: "plan",
          label: "Plan Mode",
        },
        {
          value: "ask",
          label: "Ask Mode",
        },
        {
          value: "back",
          label: "← Back to main menu",
        },
      ],
    });

    /**
     * =================================================
     * EXIT CLI MODE
     * =================================================
     *
     * User either:
     *
     * - Pressed ESC
     * - Pressed CTRL + C
     * - Selected Back
     *
     * =================================================
     */
    if (isCancel(mode) || mode === "back") {
      console.log("");

      console.log(chalk.dim("Leaving CLI mode..."));

      console.log("");

      return;
    }

    /**
     * =================================================
     * AGENT MODE
     * =================================================
     *
     * The Agent acts as the intelligent
     * project orchestrator.
     *
     * Responsibilities:
     *
     * - Understand goals
     * - Analyze requirements
     * - Generate plans
     * - Coordinate tools
     *
     * =================================================
     */
    if (mode === "agent") {
      console.log("");

      console.log(chalk.green("Starting Agent Mode..."));

      console.log("");

      await runAgentMode();

      continue;
    }

    /**
     * =================================================
     * PLAN MODE
     * =================================================
     *
     * Future:
     *
     * Generate structured execution plans.
     *
     * =================================================
     */
    if (mode === "plan") {
      console.log("");

      console.log(chalk.green("Starting Plan Mode..."));

      console.log(chalk.dim("Plan Mode is under development."));

      console.log("");

      continue;
    }

    /**
     * =================================================
     * ASK MODE
     * =================================================
     *
     * Future:
     *
     * Direct AI conversations.
     *
     * =================================================
     */
    if (mode === "ask") {
      console.log("");

      console.log(chalk.green("Starting Ask Mode..."));

      console.log(chalk.dim("Ask Mode is under development."));

      console.log("");

      continue;
    }
  }
}
