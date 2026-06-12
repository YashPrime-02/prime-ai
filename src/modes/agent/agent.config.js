/**
 * =====================================================
 * PRIME AI - AGENT CONFIGURATION
 * =====================================================
 *
 * PURPOSE
 * -------
 * Central location for Agent settings.
 *
 * The Agent uses these values to
 * understand:
 *
 * - Which files can be accessed
 * - Which folders should be ignored
 * - Which tools are allowed
 *
 * =====================================================
 */

/**
 * =====================================================
 * ACTION TYPES
 * =====================================================
 *
 * All actions that the agent can
 * perform inside a project.
 *
 * =====================================================
 */
export const ACTION_TYPES = {
  FILE_CREATE: "file_create",
  FILE_MODIFY: "file_modify",
  FILE_DELETE: "file_delete",
  FOLDER_CREATE: "folder_create",
  CODE_ANALYSIS: "code_analysis",
  TOOL_EXECUTE: "tool_execute",
};

/**
 * =====================================================
 * ACTION STATUS
 * =====================================================
 *
 * Tracks lifecycle of an action.
 *
 * =====================================================
 */
export const ACTION_STATUS = {
  PENDING: "pending",
  EXECUTED: "executed",
  APPROVED: "approved",
  REJECTED: "rejected",
};

/**
 * =====================================================
 * DEFAULT AGENT CONFIG
 * =====================================================
 *
 * Returns default configuration.
 *
 * =====================================================
 */
export function createAgentConfig() {
  return {
    /**
     * Root project directory.
     */
    codebasePath: process.cwd(),

    /**
     * Maximum file size to read.
     *
     * 1 MB
     */
    maxFileSizeToRead: 1024 * 1024,

    /**
     * Ignore patterns.
     */
    excludePatterns: [
      "node_modules",
      ".git",
      "dist",
      "build",
      ".next",
      "*.log",
      ".env*",
    ],

    /**
     * Tool Permissions
     */
    tools: {
      allowShellExecution: true,
      allowFileModification: true,
      allowFileCreation: true,
      allowFolderCreation: true,
    },
  };
}

/**
 * =====================================================
 * MUTATION CHECK
 * =====================================================
 *
 * Determines whether an action
 * changes the filesystem.
 *
 * =====================================================
 */
export function isMutationType(type) {
  return (
    type === ACTION_TYPES.FILE_CREATE ||
    type === ACTION_TYPES.FILE_MODIFY ||
    type === ACTION_TYPES.FILE_DELETE ||
    type === ACTION_TYPES.FOLDER_CREATE ||
    type === ACTION_TYPES.TOOL_EXECUTE
  );
}
