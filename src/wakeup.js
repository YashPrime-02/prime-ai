/**
 * ==========================================================
 * PRIME AI - WAKEUP MODULE
 * ==========================================================
 *
 * PURPOSE
 * -------
 * This file controls everything that appears when
 * Prime AI starts.
 *
 * Think of it as:
 *
 * "Prime AI is waking up..."
 *
 * Later we can add:
 * - Clack intro screens
 * - Loading spinners
 * - Startup animations
 * - AI status checks
 * - Memory loading
 *
 * ==========================================================
 */


import chalk from "chalk";

/**
 * Application Information
 *
 * Keeping values here makes them easy
 * to update later.
 */

const APP_NAME = "PRIME AI";
const APP_VERSION = "1.0.0";
const APP_TAGLINE = "Your Personal AI Assistant";

/**
 * UI Constants
 */
const DIVIDER = "══════════════════════════════════════════════════════";

const COMMANDS = ["prime-ai chat", "prime-ai help", "prime-ai memory"];

/**
 * Display startup screen
 */
export function wakeup() {
  /**
   * Add some breathing room
   */
  console.clear();

  /**
   * Top Divider
   */
  console.log(chalk.blueBright(DIVIDER));

  /**
   * Main Logo
   */
  console.log(chalk.cyanBright.bold(`🤖 ${APP_NAME}`));

  /**
   * Tagline
   */
  console.log(chalk.white(APP_TAGLINE));

  /**
   * Bottom Divider
   */
  console.log(chalk.blueBright(DIVIDER));

  console.log("");

  /**
   * System Information
   */
  console.log(chalk.yellow(`Version  : ${APP_VERSION}`));

  console.log(chalk.green("Status   : Online ✓"));

  console.log("");

  /**
   * Available Commands
   */
  console.log(chalk.cyanBright("Available Commands"));

  COMMANDS.forEach((command) => {
    console.log(chalk.white(`  • ${command}`));
  });

  console.log("");

  /**
   * Footer Message
   */
  console.log(chalk.gray("Ready to assist. Type a command to continue."));

  console.log("");
}
