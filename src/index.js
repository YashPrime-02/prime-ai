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
 * - Configure Commander
 * - Register CLI Commands
 * - Launch the Wakeup Screen
 * - Connect Future AI Features
 *
 * Every command will eventually start here.
 *
 * =====================================================
 */

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
 *
 * Displayed when users run:
 *
 * prime-ai --help
 * prime-ai --version
 *
 * =====================================================
 */
program.name("prime-ai").description("Prime AI CLI Assistant").version("1.0.0");

/**
 * =====================================================
 * DEFAULT APPLICATION ACTION
 * =====================================================
 *
 * Runs when the user executes:
 *
 * prime-ai
 *
 * Since no command was supplied,
 * we launch the Prime AI startup flow.
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
 * Runs when the user executes:
 *
 * prime-ai wakeup
 *
 * This command exists mainly for:
 *
 * - Testing
 * - Development
 * - Direct Startup Access
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
 * Commander reads the user input and
 * determines which command should run.
 *
 * Examples:
 *
 * prime-ai
 * prime-ai wakeup
 * prime-ai --help
 *
 * Without parse(), Commander will not
 * execute any commands.
 *
 * =====================================================
 */
program.parse();
