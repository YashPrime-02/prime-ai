/**
 * =====================================================
 * PRIME AI - APPROVAL FLOW
 * =====================================================
 *
 * PURPOSE
 * -------
 * Handles human approval before
 * Agent actions are executed.
 *
 * Responsibilities:
 *
 * - Review pending actions
 * - Show file diffs
 * - Approve changes
 * - Reject changes
 *
 * =====================================================
 */

import { select, isCancel } from "@clack/prompts";

import chalk from "chalk";

import { composeBeforeAfter, formatPatch } from "./diff-view.js";

/**
 * =====================================================
 * GROUP PENDING ACTIONS
 * =====================================================
 *
 * Groups actions by file path so
 * multiple edits to the same file
 * appear as one review item.
 *
 * =====================================================
 */
function groupPending(pending) {
  const byPath = new Map();

  const shellActions = [];

  /**
   * Separate shell commands
   * from file actions.
   */
  for (const action of pending) {
    if (action.type === "tool_execute") {
      shellActions.push(action);
      continue;
    }

    const key = action.path;

    if (!byPath.has(key)) {
      byPath.set(key, []);
    }

    byPath.get(key).push(action);
  }

  const groups = [];

  /**
   * Process file groups.
   */
  const entries = [...byPath.entries()].sort(([a], [b]) => a.localeCompare(b));

  for (const [path, actions] of entries) {
    const sorted = actions.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );

    const ids = sorted.map((item) => item.id);

    /**
     * Folder Creation
     */
    if (sorted.every((item) => item.type === "folder_create")) {
      groups.push({
        label: `Create folder: ${path}`,
        actionIds: ids,
        patch: null,
      });

      continue;
    }

    /**
     * Build Diff
     */
    const { before, after } = composeBeforeAfter(sorted);

    const patch = formatPatch(path, before, after);

    const kinds = [...new Set(sorted.map((item) => item.type))].join(", ");

    groups.push({
      label: `${path} (${kinds})`,
      actionIds: ids,
      patch,
    });
  }

  /**
   * Add Shell Commands
   */
  for (const action of shellActions) {
    groups.push({
      label: `Shell: ${action.details.command ?? "(no command)"}`,
      actionIds: [action.id],
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
 * Reviews pending actions before
 * execution.
 *
 * Returns:
 *
 * true  -> Approved actions exist
 * false -> No approved actions
 *
 * =====================================================
 */
export async function runApprovalFlow(tracker) {
  const pending = tracker.getPendingMutations();

  /**
   * Nothing To Review
   */
  if (pending.length === 0) {
    console.log(
      chalk.dim("\nNo staged file, folder, or shell changes to review.\n"),
    );

    return false;
  }

  /**
   * Review Strategy
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
   * Cancel Everything
   */
  if (isCancel(choice) || choice === "cancel") {
    for (const action of pending) {
      tracker.updateStatus(action.id, "rejected", false);
    }

    return false;
  }

  /**
   * Approve Everything
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
            label: "Show Diff",

            hint: group.patch ? "" : "N/A",
          },

          {
            value: "reject",
            label: "Reject",
          },
        ],
      });

      /**
       * Cancel Review
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
          console.log("");

          console.log(chalk.cyan("================================"));

          console.log(group.patch);

          console.log(chalk.cyan("================================"));

          console.log("");
        }

        continue;
      }

      /**
       * Approve / Reject
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
   * Check For Approved Actions
   */
  return tracker.getActions().some((action) => action.status === "approved");
}
