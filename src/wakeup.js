/**
 * ==========================================================
 * PRIME AI - WAKEUP MODULE
 * ==========================================================
 *
 * PURPOSE
 * -------
 * Responsible for displaying the startup screen.
 *
 * Think of this file as:
 *
 * "Prime AI is waking up..."
 *
 * Features:
 *
 * - ASCII Banner
 * - Banner Shadow Effect
 * - Version Information
 * - Available Commands
 * - Startup Status
 * - Startup Mode Selection
 *
 * Future Additions:
 *
 * - Loading Animations
 * - Memory Loading
 * - User Profiles
 * - AI Health Checks
 * - Startup Diagnostics
 *
 * ==========================================================
 */

import chalk from "chalk";
import figlet from "figlet";
import { select, isCancel } from "@clack/prompts";
import { runCliMode } from "./modes/cli.js";

/**
 * ==========================================================
 * APPLICATION CONFIGURATION
 * ==========================================================
 */

const APP_NAME = "PRIME AI";
const APP_VERSION = "1.0.0";
const APP_TAGLINE = "Your Personal AI Assistant";

/**
 * Banner Font
 *
 * Figlet converts text into ASCII art.
 */
const BANNER_FONT = "ANSI Shadow";

/**
 * Theme Colors
 *
 * SHADOW = Banner shadow layer
 * FACE   = Main banner layer
 */
const SHADOW = chalk.hex("#5b4d9e");
const FACE = chalk.hex("#8dcdf8").bold;

/**
 * Available Commands
 *
 * Displayed on startup.
 */
const COMMANDS = ["prime-ai chat", "prime-ai help", "prime-ai memory"];

/**
 * Divider Line
 */
const DIVIDER = "══════════════════════════════════════════════════════";

/**
 * ==========================================================
 * PRINT ASCII BANNER WITH SHADOW
 * ==========================================================
 *
 * Creates a pseudo 3D effect by printing:
 *
 * 1. Shadow Layer
 * 2. Face Layer
 *
 * ==========================================================
 */
function printBannerWithShadow(ascii) {
  /**
   * Split banner into individual lines
   */
  const bannerLines = ascii.replace(/\s+$/, "").split("\n");

  /**
   * Find longest line
   *
   * Used for alignment.
   */
  const maxLength = Math.max(...bannerLines.map((line) => line.length), 0);

  const rowWidth = maxLength + 2;

  /**
   * Print Shadow Layer
   */
  for (const line of bannerLines) {
    console.log(SHADOW((" " + line).padEnd(rowWidth)));
  }

  /**
   * Move cursor upward
   *
   * ANSI Escape Code:
   *
   * \x1b = Escape Character
   * [nA  = Move cursor up n lines
   */
  process.stdout.write(`\x1b[${bannerLines.length}A`);

  /**
   * Print Main Banner Layer
   */
  for (const line of bannerLines) {
    console.log(FACE(line.padEnd(rowWidth)));
  }

  console.log("");
}

/**
 * ==========================================================
 * WAKEUP FUNCTION
 * ==========================================================
 *
 * Main startup sequence.
 *
 * ==========================================================
 */
export async function wakeup() {
  /**
   * Clear terminal
   */
  console.clear();

  let ascii;

  /**
   * Generate ASCII Banner
   */
  try {
    ascii = figlet.textSync(APP_NAME, {
      font: BANNER_FONT,
    });
  } catch {
    /**
     * Fallback Font
     */
    ascii = figlet.textSync(APP_NAME, {
      font: "Standard",
    });
  }

  /**
   * Render Banner
   */
  printBannerWithShadow(ascii);

  /**
   * Tagline
   */
  console.log(chalk.whiteBright(APP_TAGLINE));

  /**
   * Divider
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

  /**
   * ========================================================
   * MODE SELECTION
   * ========================================================
   *
   * Ask the user how Prime AI
   * should run.
   *
   * ========================================================
   */
  const mode = await select({
    message: "Which mode would you like to start?",
    options: [
      {
        value: "cli",
        label: "CLI Mode",
        hint: "Run inside terminal",
      },
      {
        value: "telegram",
        label: "Telegram Mode",
        hint: "Connect with Telegram",
      },
    ],
  });

  /**
   * ========================================================
   * HANDLE CANCELLATION
   * ========================================================
   *
   * User may:
   *
   * - Press ESC
   * - Press CTRL + C
   *
   * ========================================================
   */
  if (isCancel(mode)) {
    console.log("");

    console.log(chalk.yellow("Prime AI startup cancelled."));

    console.log("");

    return;
  }

  /**
   * ========================================================
   * MODE ROUTING
   * ========================================================
   *
   * Route user to selected mode.
   *
   * ========================================================
   */

  /**
   * CLI MODE
   */
  if (mode === "cli") {
    console.log("");

    console.log(chalk.green("✓ CLI mode selected"));

    console.log(chalk.dim("Launching terminal assistant..."));

    console.log("");

    await runCliMode();

    return;
  }

  /**
   * TELEGRAM MODE
   */
  if (mode === "telegram") {
    console.log("");

    console.log(chalk.green("✓ Telegram mode selected"));

    console.log(chalk.dim("Preparing Telegram integration..."));

    console.log("");

    return;
  }
}
