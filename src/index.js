/**
 * Commander is used for building CLI commands
 *
 * Example:
 * prime-ai
 * prime-ai chat
 * prime-ai help
 */

import { Command } from "commander";

/**
 * Chalk is used for terminal colors
 */
import chalk from "chalk";

/**
 * Create commander application
 */
const program = new Command();

/**
 * Basic information
 */

program.name("prime-ai").description("Prime AI CLI Assistant").version("1.0.0");

/**
 * Default action
 *
 * Runs when user simply types:
 *
 * prime-ai
 */

program.action(() => {
  console.log("");

  console.log(chalk.cyan("🚀 Welcome to Prime AI"));

  console.log(chalk.green("Your Personal AI Assistant"));

  console.log("");

  console.log(chalk.yellow("Version: 1.0.0"));

  console.log("");
});

/**
 * Parse terminal arguments
 *
 * VERY IMPORTANT
 *
 * Without this,
 * Commander won't work.
 */

program.parse();
