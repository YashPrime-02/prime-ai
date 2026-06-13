/**
 * =====================================================
 * PRIME AI - TOOL EXECUTOR
 * =====================================================
 *
 * PURPOSE
 * -------
 * Executes all Agent tools.
 *
 * The Agent never directly touches
 * the filesystem.
 *
 * Instead:
 *
 * Agent
 *   ↓
 * Tool
 *   ↓
 * Tool Executor
 *   ↓
 * Action Tracker
 *   ↓
 * User Approval
 *
 * =====================================================
 */

import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { homedir } from "node:os";

import { spawnSync } from "node:child_process";

/**
 * =====================================================
 * TEXT FILE EXTENSIONS
 * =====================================================
 *
 * Used when reading and searching
 * files.
 *
 * =====================================================
 */
const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".mdx",
  ".css",
  ".html",
  ".yml",
  ".yaml",
  ".toml",
  ".txt",
]);

/**
 * =====================================================
 * IS TEXT FILE
 * =====================================================
 *
 * Determines whether a file should
 * be treated as text.
 *
 * =====================================================
 */
function isProbablyTextFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  return TEXT_EXTENSIONS.has(extension) || extension === "";
}

/**
 * =====================================================
 * TOOL EXECUTOR
 * =====================================================
 *
 * Core filesystem engine used by
 * Agent Mode.
 *
 * =====================================================
 */
export class ToolExecutor {
  constructor(tracker, config) {
    /**
     * Action Tracker
     */
    this.tracker = tracker;

    /**
     * Agent Config
     */
    this.config = config;

    /**
     * Overlay Storage
     *
     * Stores staged file content
     * before approval.
     */
    this.overlay = new Map();

    /**
     * Deleted Files
     *
     * Tracks files scheduled
     * for deletion.
     */
    this.deleted = new Set();

    /**
     * Path Normalizer
     */
    this.norm = (relPath) =>
      path.posix
        .normalize(relPath.split(path.sep).join("/"))
        .replace(/^\.\//, "");
  }

  /**
   * ===================================================
   * RESOLVE SAFE PATH
   * ===================================================
   *
   * Prevents path traversal.
   *
   * Example:
   *
   * ../../secret.txt
   *
   * will be blocked.
   *
   * ===================================================
   */
  resolveSafe(relPath) {
    const absolutePath = path.resolve(this.config.codebasePath, relPath);

    const rootPath = path.resolve(this.config.codebasePath);

    const relativeCheck = path.relative(rootPath, absolutePath);

    if (relativeCheck.startsWith("..") || path.isAbsolute(relativeCheck)) {
      throw new Error(`Path escapes workspace: ${relPath}`);
    }

    return absolutePath;
  }

  /**
   * ===================================================
   * EXCLUDED CHECK
   * ===================================================
   *
   * Determines whether a path is
   * blocked by configuration.
   *
   * ===================================================
   */
  excluded(relPath) {
    const normalized = this.norm(relPath);

    const segments = normalized.split("/");

    const baseName = segments[segments.length - 1] ?? "";

    for (const pattern of this.config.excludePatterns) {
      if (pattern === "*.log" && baseName.endsWith(".log")) {
        return true;
      }

      if (pattern === ".env*" && baseName.startsWith(".env")) {
        return true;
      }

      if (pattern.includes("*")) {
        continue;
      }

      if (
        segments.includes(pattern) ||
        normalized === pattern ||
        normalized.startsWith(`${pattern}/`)
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * ===================================================
   * ASSERT NOT EXCLUDED
   * ===================================================
   */
  assertNotExcluded(relPath, operation) {
    if (this.excluded(relPath)) {
      throw new Error(`${operation}: path is excluded by policy: ${relPath}`);
    }
  }

  /**
   * ===================================================
   * GET EFFECTIVE TEXT
   * ===================================================
   *
   * Returns:
   *
   * - Overlay version
   * - Disk version
   * - Undefined if deleted
   *
   * ===================================================
   */
  getEffectiveText(relPath) {
    const key = this.norm(relPath);

    if (this.deleted.has(key)) {
      return undefined;
    }

    if (this.overlay.has(key)) {
      return this.overlay.get(key);
    }

    const absolutePath = this.resolveSafe(relPath);

    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
      return undefined;
    }

    return fs.readFileSync(absolutePath, "utf8");
  }

  /**
   * ===================================================
   * FIND FILE BY NAME
   * ===================================================
   *
   * Allows the agent to locate files
   * anywhere inside the workspace.
   *
   * Examples:
   *
   * index.js
   * package.json
   * orchestrator.js
   *
   * ===================================================
   */
  findFileByName(fileName, currentDir) {
    const entries = fs.readdirSync(currentDir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      /**
       * Skip large folders
       */
      if (
        entry.isDirectory() &&
        ["node_modules", ".git", "dist", "build"].includes(entry.name)
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        const found = this.findFileByName(fileName, fullPath);

        if (found) {
          return found;
        }

        continue;
      }

      if (entry.name.toLowerCase() === fileName.toLowerCase()) {
  console.log(
    chalk.cyan("🔍 Located"),
    chalk.whiteBright(fileName),
    chalk.gray("→"),
    chalk.magenta(fullPath),
  );

  return fullPath;
}
    }

    return null;
  }

  /**
   * ===================================================
   * READ FILE
   * ===================================================
   *
   * PURPOSE
   * -------
   * Reads a text file from the workspace.
   *
   * Used by:
   *
   * - Agent explanations
   * - Code analysis
   * - Future AI tool calls
   *
   * ===================================================
   */
  async readFile(relPath) {
    /**
     * Ensure path is allowed
     */
    this.assertNotExcluded(relPath, "read_file");

    /**
     * Try direct path first
     */
    let absolutePath = this.resolveSafe(relPath);

    /**
     * If the direct path does not
     * exist, search the workspace.
     */
    if (!fs.existsSync(absolutePath)) {
      const discovered = this.findFileByName(
        path.basename(relPath),
        this.config.codebasePath,
      );

      if (!discovered) {
        throw new Error(
  `File not found in workspace: ${relPath}`,
);
      }

      absolutePath = discovered;
    }

    /**
     * Must be a file
     */
    const stats = fs.statSync(absolutePath);

    if (!stats.isFile()) {
      throw new Error(`Not a file: ${relPath}`);
    }

    /**
     * File size protection
     */
    if (stats.size > this.config.maxFileSizeToRead) {
      throw new Error(`File exceeds maximum size limit: ${relPath}`);
    }

    /**
     * Text files only
     */
    if (!isProbablyTextFile(absolutePath)) {
      throw new Error(`Unsupported file type: ${relPath}`);
    }

    /**
     * Check staged content first
     */
    const effectiveText = this.getEffectiveText(relPath);

    if (typeof effectiveText === "string") {
      return effectiveText;
    }

    console.log(
  chalk.green("✓ Reading"),
  chalk.magenta(absolutePath),
);

    /**
     * Read from disk
     */
    return fs.readFileSync(absolutePath, "utf8");
  }
}
