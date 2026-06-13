/**
 * =====================================================
 * PRIME AI MAIN APPLICATION
 * =====================================================
 *
 * This file acts as the entry point of Prime AI.
 *
 * Think of it as:
 *
 * "The control room of the application."
 *
 * Responsibilities:
 *
 * - Load Environment Variables
 * - Configure Commander
 * - Register CLI Commands
 * - Launch the Wakeup Screen
 * - Connect Future AI Features
 *
 * Every command will eventually start here.
 *
 * =====================================================
 */

/**
 * =====================================================
 * LOAD ENVIRONMENT VARIABLES
 * =====================================================
 *
 * Loads values from:
 *
 * .env
 *
 * Example:
 *
 * AI_PROVIDER=ollama
 * OLLAMA_MODEL=qwen2.5:1.5b
 * OLLAMA_BASE_URL=http://localhost:11434
 *
 * Must be loaded before importing
 * configuration-dependent modules.
 *
 * =====================================================
 */
import "dotenv/config";

import { Command } from "commander";

/**
 * Import Wakeup Module
 *
 * The wakeup module is responsible for:
 *
 * - Startup Banner
 * - Mode Selection
 * - Initial User Experience
 *
 * Keeping startup logic separate from
 * application logic makes the project
 * easier to maintain.
 */
import { wakeup } from "./wakeup.js";

/**
 * =====================================================
 * CREATE COMMANDER APPLICATION
 * =====================================================
 *
 * Commander helps us build a professional
 * command-line application.
 *
 * Examples:
 *
 * prime-ai
 * prime-ai wakeup
 * prime-ai --help
 * prime-ai --version
 *
 * =====================================================
 */
const program = new Command();

/**
 * =====================================================
 * APPLICATION METADATA
 * =====================================================
 */
program.name("prime-ai").description("Prime AI CLI Assistant").version("1.0.0");

/**
 * =====================================================
 * DEFAULT APPLICATION ACTION
 * =====================================================
 *
 * Runs when:
 *
 * prime-ai
 *
 * =====================================================
 */
program.action(async () => {
  await wakeup();
});

/**
 * =====================================================
 * WAKEUP COMMAND
 * =====================================================
 *
 * Runs when:
 *
 * prime-ai wakeup
 *
 * =====================================================
 */
program
  .command("wakeup")
  .description("Display Prime AI startup screen")
  .action(async () => {
    await wakeup();
  });

/**
 * =====================================================
 * PARSE COMMAND-LINE ARGUMENTS
 * =====================================================
 *
 * Without parse(), Commander will not
 * execute any commands.
 *
 * =====================================================
 */
program.parse();
