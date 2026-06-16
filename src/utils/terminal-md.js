/**
 * =====================================================
 * TERMINAL MARKDOWN RENDERER
 * =====================================================
 *
 * PURPOSE
 * -------
 * Converts Markdown into formatted
 * terminal output.
 *
 * Used for:
 *
 * - AI Responses
 * - Code Explanations
 * - Plans
 * - Agent Reports
 *
 * =====================================================
 */

import { marked } from "marked";
import { markedTerminal } from "marked-terminal";

/**
 * Prevents multiple registrations
 * of marked-terminal.
 */
let ready = false;

/**
 * =====================================================
 * INITIALIZE MARKED
 * =====================================================
 *
 * Configures terminal markdown
 * rendering only once.
 *
 * =====================================================
 */

function ensureMarked() {
  if (ready) {
    return;
  }

  const width = Math.max(
    40,
    Math.min(process.stdout.columns || 80, 120),
  );

  marked.use(
    markedTerminal({
      width,
      reflowText: true,
    }),
  );

  ready = true;
}

/**
 * =====================================================
 * RENDER TERMINAL MARKDOWN
 * =====================================================
 *
 * Converts markdown text into
 * terminal-friendly output.
 *
 * Example:
 *
 * renderTerminalMarkdown(
 *   "# Hello World"
 * );
 *
 * =====================================================
 */

export function renderTerminalMarkdown(source) {
  ensureMarked();

  return marked.parse(source.trimEnd(), {
    async: false,
  });
}