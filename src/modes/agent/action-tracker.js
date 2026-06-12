/**
 * =====================================================
 * PRIME AI - ACTION TRACKER
 * =====================================================
 *
 * PURPOSE
 * -------
 * Tracks all actions performed by
 * Agent Mode.
 *
 * Examples:
 *
 * - File Creation
 * - File Modification
 * - Folder Creation
 * - Tool Execution
 * - Code Analysis
 *
 * Think of this as:
 *
 * Agent Memory
 *
 * =====================================================
 */

import { isMutationType } from "./agent.config.js";

/**
 * =====================================================
 * ACTION TRACKER
 * =====================================================
 *
 * Stores all agent actions and
 * provides helper methods for
 * querying and updating them.
 *
 * =====================================================
 */
export class ActionTracker {
  constructor() {
    /**
     * Internal action storage.
     */
    this.actions = [];
  }

  /**
   * ===================================================
   * LOG ACTION
   * ===================================================
   *
   * Creates and stores a new action.
   *
   * ===================================================
   */
  log(entry) {
    const action = {
      id: entry.id ?? `action_${this.actions.length}`,

      timestamp: entry.timestamp ?? new Date(),

      type: entry.type,

      path: entry.path,

      details: {
        ...entry.details,
      },

      status: entry.status,

      userApproved: entry.userApproved,
    };

    this.actions.push(action);

    return action;
  }

  /**
   * ===================================================
   * GET ALL ACTIONS
   * ===================================================
   *
   * Returns complete action history.
   *
   * ===================================================
   */
  getActions() {
    return this.actions;
  }

  /**
   * ===================================================
   * GET PENDING MUTATIONS
   * ===================================================
   *
   * Returns actions that:
   *
   * - Modify files
   * - Create files
   * - Delete files
   * - Create folders
   * - Execute tools
   *
   * AND
   *
   * Have not yet been approved.
   *
   * ===================================================
   */
  getPendingMutations() {
    return this.actions.filter(
      (action) => isMutationType(action.type) && action.status === "pending",
    );
  }

  /**
   * ===================================================
   * UPDATE STATUS
   * ===================================================
   *
   * Updates action status.
   *
   * Example:
   *
   * pending
   * approved
   * rejected
   * executed
   *
   * ===================================================
   */
  updateStatus(id, status, userApproved) {
    const action = this.actions.find((item) => item.id === id);

    if (!action) {
      return;
    }

    action.status = status;

    if (userApproved !== undefined) {
      action.userApproved = userApproved;
    }
  }
}
