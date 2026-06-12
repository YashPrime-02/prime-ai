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
}
