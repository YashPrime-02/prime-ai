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
     * User pressed ESC
     * or selected Back.
     */
    if (isCancel(mode) || mode === "back") {
      return;
    }

    /**
     * =================================================
     * AGENT MODE
     * =================================================
     */
    if (mode === "agent") {
      console.log("");

      console.log(chalk.green("Starting Agent Mode..."));

      console.log("");

      continue;
    }

    /**
     * =================================================
     * PLAN MODE
     * =================================================
     */
    if (mode === "plan") {
      console.log("");

      console.log(chalk.green("Starting Plan Mode..."));

      console.log("");

      continue;
    }

    /**
     * =================================================
     * ASK MODE
     * =================================================
     */
    if (mode === "ask") {
      console.log("");

      console.log(chalk.green("Starting Ask Mode..."));

      console.log("");

      continue;
    }
  }
}
