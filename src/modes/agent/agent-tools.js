/**
 * =====================================================
 * PRIME AI - AGENT TOOLS
 * =====================================================
 *
 * PURPOSE
 * -------
 * Defines all tools available to
 * Agent Mode.
 *
 * The AI does not directly modify
 * files or execute commands.
 *
 * Instead:
 *
 * AI
 *  ↓
 * Tool
 *  ↓
 * Tool Executor
 *  ↓
 * Action Tracker
 *  ↓
 * User Approval
 *
 * =====================================================
 */

import { tool } from "ai";
import { z } from "zod";

/**
 * =====================================================
 * CREATE AGENT TOOLS
 * =====================================================
 *
 * Receives a ToolExecutor instance
 * and exposes available tools.
 *
 * =====================================================
 */
export function createAgentTools(executor) {
  return {
    /**
     * =================================================
     * READ FILE
     * =================================================
     */
    read_file: tool({
      description:
        "Read a text file from the workspace. Use a path relative to the project root.",

      inputSchema: z.object({
        path: z.string().describe("Relative file path"),
      }),

      execute: async ({ path }) => executor.readFile(path),
    }),

    /**
     * =================================================
     * CREATE FILE
     * =================================================
     */
    create_file: tool({
      description:
        "Stage creation of a new file. Changes are not applied until approved.",

      inputSchema: z.object({
        path: z.string(),

        content: z.string(),
      }),

      execute: async ({ path, content }) => executor.createFile(path, content),
    }),

    /**
     * =================================================
     * MODIFY FILE
     * =================================================
     */
    modify_file: tool({
      description:
        "Stage modification of an existing file. Requires approval before execution.",

      inputSchema: z.object({
        path: z.string(),

        content: z.string().describe("Complete new file contents"),
      }),

      execute: async ({ path, content }) => executor.modifyFile(path, content),
    }),

    /**
     * =================================================
     * DELETE FILE
     * =================================================
     */
    delete_file: tool({
      description:
        "Stage deletion of a file. Requires approval before execution.",

      inputSchema: z.object({
        path: z.string(),
      }),

      execute: async ({ path }) => executor.deleteFile(path),
    }),

    /**
     * =================================================
     * CREATE FOLDER
     * =================================================
     */
    create_folder: tool({
      description:
        "Stage creation of a directory. Folder is not created until approval.",

      inputSchema: z.object({
        path: z.string().describe("Relative folder path"),
      }),

      execute: async ({ path }) => executor.createFolder(path),
    }),

    /**
     * =================================================
     * LIST FILES
     * =================================================
     */
    list_files: tool({
      description: "List files and directories under a given path.",

      inputSchema: z.object({
        path: z.string(),

        recursive: z.boolean().optional().default(false),
      }),

      execute: async ({ path, recursive }) =>
        executor.listFiles(path, recursive),
    }),

    /**
     * =================================================
     * SEARCH FILES
     * =================================================
     */
    search_files: tool({
      description: 'Find files matching a pattern such as "*.js" or "**/*.md".',

      inputSchema: z.object({
        root: z.string().describe("Directory to search"),

        pattern: z.string().describe("Glob pattern"),

        content_contains: z.string().optional(),
      }),

      execute: async ({ root, pattern, content_contains }) =>
        executor.searchFiles(root, pattern, content_contains),
    }),

    /**
     * =================================================
     * ANALYZE CODEBASE
     * =================================================
     */
    analyze_codebase: tool({
      description: "Analyze project structure and provide statistics.",

      inputSchema: z.object({
        path: z.string().default("."),
      }),

      execute: async ({ path }) => executor.analyzeCodebase(path),
    }),

    /**
     * =================================================
     * EXECUTE SHELL
     * =================================================
     */
    execute_shell: tool({
      description:
        "Queue a shell command. Command executes only after approval.",

      inputSchema: z.object({
        command: z.string().describe("Shell command"),
      }),

      execute: async ({ command }) => executor.queueShell(command),
    }),

    /**
     * =================================================
     * LIST SKILLS
     * =================================================
     */
    list_skills: tool({
      description: "List available skill definitions.",

      inputSchema: z.object({}),

      execute: async () => executor.listSkills(),
    }),

    /**
     * =================================================
     * READ SKILL
     * =================================================
     */
    read_skill: tool({
      description: "Read a specific skill file.",

      inputSchema: z.object({
        path: z.string(),
      }),

      execute: async ({ path }) => executor.readSkill(path),
    }),
  };
}
