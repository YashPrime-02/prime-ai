/**
 * =====================================================
 * PRIME AI - DIFF VIEW
 * =====================================================
 *
 * PURPOSE
 * -------
 * Responsible for generating file diffs.
 *
 * A diff shows:
 *
 * - What changed
 * - What was removed
 * - What was added
 *
 * Example:
 *
 * Before:
 * console.log("Hello");
 *
 * After:
 * console.log("Hello World");
 *
 * =====================================================
 */

import { createTwoFilesPatch } from "diff";

/**
 * =====================================================
 * FORMAT PATCH
 * =====================================================
 *
 * Generates a unified diff between
 * two versions of a file.
 *
 * Parameters:
 *
 * filePath
 *   Path being modified
 *
 * before
 *   Original content
 *
 * after
 *   Updated content
 *
 * Returns:
 *
 * String containing a git-style diff.
 *
 * =====================================================
 */
export function formatPatch(filePath, before, after) {
  return createTwoFilesPatch(filePath, filePath, before, after, "", "", {
    /**
     * Number of surrounding lines
     * to include around changes.
     */
    context: 3,
  });
}

/**
 * =====================================================
 * COMPOSE BEFORE / AFTER
 * =====================================================
 *
 * Builds the effective before and after
 * state from a list of file actions.
 *
 * Example:
 *
 * File Created
 *   before = ""
 *   after  = new content
 *
 * File Modified
 *   before = old content
 *   after  = new content
 *
 * File Deleted
 *   before = existing content
 *   after  = ""
 *
 * =====================================================
 */
export function composeBeforeAfter(sortedActions) {
  /**
   * First action affecting file.
   */
  const first = sortedActions[0];

  /**
   * Last action affecting file.
   */
  const last = sortedActions[sortedActions.length - 1];

  /**
   * File Deletion
   */
  if (last.type === "file_delete") {
    return {
      before: last.details.before ?? "",
      after: "",
    };
  }

  /**
   * File Creation
   */
  const before =
    first.type === "file_create" ? "" : (first.details.before ?? "");

  /**
   * Final content
   */
  const after = last.details.after ?? "";

  return {
    before,
    after,
  };
}
