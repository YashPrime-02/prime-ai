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
 * - Agent execution limits
 *
 * =====================================================
 */

/**
 * =====================================================
 * ACTION TYPES
 * =====================================================
 */
export const ACTION_TYPES = Object.freeze({
  FILE_CREATE: "file_create",
  FILE_MODIFY: "file_modify",
  FILE_DELETE: "file_delete",
  FOLDER_CREATE: "folder_create",

  CODE_ANALYSIS: "code_analysis",

  TOOL_EXECUTE: "tool_execute",

  FILE_READ: "file_read",

  FILE_SEARCH: "file_search",
});

/**
 * =====================================================
 * ACTION STATUS
 * =====================================================
 */
export const ACTION_STATUS = Object.freeze({
  PENDING: "pending",

  EXECUTED: "executed",

  APPROVED: "approved",

  REJECTED: "rejected",
});

/**
 * =====================================================
 * DEFAULT AGENT CONFIG
 * =====================================================
 */
export function createAgentConfig() {
  return {
    /**
     * Workspace Root
     */
    codebasePath: process.cwd(),

    /**
     * Maximum file size
     * readable by the agent.
     *
     * 1 MB
     */
    maxFileSizeToRead: 1024 * 1024,

    /**
     * Maximum files returned
     * by searches.
     */
    maxSearchResults: 100,

    /**
     * Maximum recursive depth
     * when scanning directories.
     */
    maxDirectoryDepth: 10,

    /**
     * Maximum tool calls
     * during a single run.
     */
    maxToolCalls: 25,

    /**
     * Ignore Patterns
     */
    excludePatterns: [
      "node_modules",
      ".git",
      ".next",
      "dist",
      "build",

      "*.log",

      ".env*",
    ],

    /**
     * Files that should never
     * be modified automatically.
     */
    protectedFiles: ["package-lock.json", "pnpm-lock.yaml", "yarn.lock"],

    /**
     * Tool Permissions
     */
    tools: {
      allowShellExecution: true,

      allowFileModification: true,

      allowFileCreation: true,

      allowFileDeletion: true,

      allowFolderCreation: true,
    },

    /**
     * AI Runtime
     */
    ai: {
      maxSteps: 10,

      temperature: 0.2,
    },
  };
}

/**
 * =====================================================
 * MUTATION CHECK
 * =====================================================
 */
export function isMutationType(type) {
  return [
    ACTION_TYPES.FILE_CREATE,
    ACTION_TYPES.FILE_MODIFY,
    ACTION_TYPES.FILE_DELETE,
    ACTION_TYPES.FOLDER_CREATE,
    ACTION_TYPES.TOOL_EXECUTE,
  ].includes(type);
}
