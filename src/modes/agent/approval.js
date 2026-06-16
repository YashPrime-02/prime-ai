/**
 * =====================================================
 * PRIME AI - APPROVAL FLOW
 * =====================================================
 *
 * PURPOSE
 * -------
 * Handles user approval before
 * staged agent actions are applied.
 *
 * Responsibilities:
 *
 * - Review pending actions
 * - Show diffs
 * - Approve changes
 * - Reject changes
 *
 * =====================================================
 */

import { select, isCancel } from "@clack/prompts";
import chalk from "chalk";
import { composeBeforeAfter, formatPatch } from "./diff-view.js";
import { renderTerminalMarkdown } from "../../tui/terminal-md.js";

/**
 * =====================================================
 * GROUP PENDING ACTIONS
 * =====================================================
 *
 * Groups actions by file path
 * so multiple edits to the same
 * file appear together.
 *
 * =====================================================
 */

function groupPending(pending) {
  const byPath = new Map();

  const shells = [];

  for (const action of pending) {
    if (action.type === "tool_execute") {
      shells.push(action);
      continue;
    }

    const key = action.path;

    if (!byPath.has(key)) {
      byPath.set(key, []);
    }

    byPath.get(key).push(action);
  }

  const groups = [];

  const pathEntries = [...byPath.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );

  for (const [filePath, actions] of pathEntries) {
    const sorted = actions.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );

    const ids = sorted.map((action) => action.id);

    /**
     * Folder Creation
     */
    if (sorted.every((action) => action.type === "folder_create")) {
      groups.push({
        label: `Create folder: ${filePath}`,
        actionIds: ids,
        patch: null,
      });

      continue;
    }

    /**
     * File Changes
     */
    const { before, after } = composeBeforeAfter(sorted);

    const patch = formatPatch(filePath, before, after);

    const kinds = [...new Set(sorted.map((action) => action.type))].join(", ");

    groups.push({
      label: `${filePath} (${kinds})`,
      actionIds: ids,
      patch,
    });
  }

  /**
   * Shell Commands
   */
  for (const shell of shells) {
    groups.push({
      label: `Shell: ${shell.details.command ?? "(no command)"}`,
      actionIds: [shell.id],
      patch: null,
    });
  }

  return groups;
}

/**
 * =====================================================
 * RUN APPROVAL FLOW
 * =====================================================
 *
 * Returns:
 *
 * true  -> approved actions exist
 * false -> no approved actions
 *
 * =====================================================
 */
export async function runApprovalFlow(tracker) {
  const pending = tracker.getPendingMutations();

  /**
   * No Changes
   */
  if (pending.length === 0) {
    console.log(
      chalk.dim("\nNo staged file, folder, or shell changes to review.\n"),
    );

    return false;
  }

  /**
   * Approval Menu
   */
  const choice = await select({
    message: "Apply staged changes?",

    options: [
      {
        value: "all",
        label: "Approve and apply all",
      },

      {
        value: "select",
        label: "Review one by one",
      },

      {
        value: "cancel",
        label: "Cancel",
      },
    ],
  });

  /**
   * Cancel
   */
  if (isCancel(choice) || choice === "cancel") {
    for (const action of pending) {
      tracker.updateStatus(action.id, "rejected", false);
    }

    return false;
  }

  /**
   * Approve All
   */
  if (choice === "all") {
    for (const action of pending) {
      tracker.updateStatus(action.id, "approved", true);
    }

    return true;
  }

  /**
   * Review Individually
   */
  for (const group of groupPending(pending)) {
    while (true) {
      const option = await select({
        message: chalk.bold(group.label),

        options: [
          {
            value: "accept",
            label: "Accept",
          },

          {
            value: "diff",
            label: "Show diff",
            hint: group.patch ? "" : "N/A",
          },

          {
            value: "reject",
            label: "Reject",
          },
        ],
      });

      /**
       * Cancel During Review
       */
      if (isCancel(option)) {
        for (const action of pending) {
          tracker.updateStatus(action.id, "rejected", false);
        }

        return false;
      }

      /**
       * Show Diff
       */
      if (option === "diff") {
        if (group.patch) {
          console.log(
            "\n" +
              renderTerminalMarkdown("```diff\n" + group.patch + "\n```\n") +
              "\n",
          );
        }

        continue;
      }

      /**
       * Accept / Reject
       */
      for (const id of group.actionIds) {
        tracker.updateStatus(
          id,
          option === "accept" ? "approved" : "rejected",
          option === "accept",
        );
      }

      break;
    }
  }

  /**
   * Return Whether Anything
   * Was Approved
   */
  return tracker.getActions().some((action) => action.status === "approved");
}
