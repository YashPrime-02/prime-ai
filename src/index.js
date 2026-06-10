/**
 * =====================================================
 * PRIME AI MAIN APPLICATION
 * =====================================================
 *
 * This is the brain of Prime AI.
 *
 * Responsibilities:
 *
 * - Configure Commander
 * - Register Commands
 * - Start Wakeup Screen
 * - Start Future AI Features
 *
 * =====================================================
 */


import { Command } from "commander";

/**
 * Import Wakeup Module
 *
 * This keeps startup UI separate
 * from application logic.
 */
import { wakeup } from "./wakeup.js";

/**
 * Create Commander App
 */
const program = new Command();

/**
 * Basic CLI Information
 */
program
.name("prime-ai")
.description("Prime AI CLI Assistant")
.version("1.0.0");

/**
 * Default Command
 *
 * Runs when:
 *
 * prime-ai
 */

program.action(() => {
  wakeup();
});



/**
 * Parse CLI Arguments
 *
 * Required by Commander.
 */
program.parse();
