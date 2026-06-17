/**
 * =====================================================
 * PRIME AI - AGENT ORCHESTRATOR
 * =====================================================
 *
 * PURPOSE
 * -------
 * The orchestrator acts as the brain
 * of Agent Mode.
 *
 * Responsibilities:
 *
 * - Accept user goals
 * - Initialize agent systems
 * - Load tools
 * - Connect AI provider
 * - Read project files
 * - Stage modifications
 * - Coordinate approval flow
 *
 * =====================================================
 */

import chalk from "chalk";

import { text, isCancel } from "@clack/prompts";

import { createAgentConfig } from "./agent.config.js";

import { ActionTracker } from "./action-tracker.js";

import { ToolExecutor } from "./tool-executor.js";

import { createAgentTools } from "./agent-tools.js";

import { runApprovalFlow } from "./approval-flow.js";

import { generateResponse } from "../../../services/ai.service.js";

/**
 * =====================================================
 * EXTRACT FILE NAME
 * =====================================================
 */
function extractFileName(goal) {
  const match = goal.match(
    /\b[\w.-]+\.(js|jsx|ts|tsx|json|md|css|html|yml|yaml|txt)\b/i,
  );

  return match?.[0] ?? null;
}

/**
 * =====================================================
 * DETECT INTENT
 * =====================================================
 */
function detectIntent(goal) {
  const text = goal.toLowerCase();

  if (
    text.includes("modify") ||
    text.includes("update") ||
    text.includes("rewrite") ||
    text.includes("replace") ||
    text.includes("change") ||
    text.includes("edit")
  ) {
    return "modify";
  }

  if (
    text.includes("create") ||
    text.includes("build") ||
    text.includes("generate") ||
    text.includes("make") ||
    text.includes("new file") ||
    text.includes("create file")
  ) {
    return "create";
  }

  if (text.includes("delete file") || text.includes("remove file")) {
    return "delete";
  }

  return "explain";
}

/**
 * =====================================================
 * CLEAN AI FILE RESPONSE
 * =====================================================
 *
 * Removes markdown fences that
 * local models frequently return.
 *
 * =====================================================
 */
function cleanAiFileResponse(text) {
  return text
    .replace(/^```[\w-]*\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();
}

/**
 * =====================================================
 * RUN AGENT MODE
 * =====================================================
 */
export async function runAgentMode() {
  console.log("");

  console.log(chalk.bold.cyan("🤖 Agent Mode"));

  console.log("");

  const goal = await text({
    message: "What would you like the agent to do?",
    placeholder: "Build a React portfolio website",
  });

  if (isCancel(goal) || !goal?.trim()) {
    console.log("");

    console.log(chalk.dim("Agent mode cancelled."));

    console.log("");

    return;
  }

  /**
   * ===================================================
   * INITIALIZE AGENT SYSTEMS
   * ===================================================
   */

  const config = createAgentConfig();

  const tracker = new ActionTracker();

  const executor = new ToolExecutor(tracker, config);

  const tools = createAgentTools(executor);

  const agentContext = {
    goal: goal.trim(),
    config,
    tracker,
    executor,
    tools,
    createdAt: new Date(),
  };

  console.log("");

  console.log(chalk.green("✓ Goal received"));

  console.log("");

  console.log(chalk.white("Goal:"));

  console.log(chalk.dim(agentContext.goal));

  console.log("");

  console.log(chalk.green("✓ Agent initialized"));
  console.log(chalk.green("✓ Action tracker ready"));
  console.log(chalk.green("✓ Tool executor ready"));
  console.log(chalk.green("✓ Agent tools loaded"));

  console.log("");

  console.log(chalk.cyan("Thinking..."));

  console.log("");

  try {
    let prompt = goal.trim();

    const fileName = extractFileName(goal);

    const intent = detectIntent(goal);

    let targetFile = fileName;

    if (!targetFile && intent === "create") {
      const lower = goal.toLowerCase();

      if (
        lower.includes("landing page") ||
        lower.includes("website") ||
        lower.includes("portfolio")
      ) {
        targetFile = "index.html";
      } else if (lower.includes("server")) {
        targetFile = "server.js";
      } else {
        targetFile = "generated-file.txt";
      }
    }

    console.log("");
    console.log(chalk.yellow("========== DEBUG =========="));
    console.log("Goal       :", goal);
    console.log("Intent     :", intent);
    console.log("FileName   :", fileName);
    console.log("TargetFile :", targetFile);
    console.log("===========================");
    console.log("");

    /**
     * ===============================================
     * EXPLAIN FILE
     * ===============================================
     */
    if (fileName && intent === "explain") {
      console.log(chalk.cyan("📖 Reading file:"), chalk.whiteBright(fileName));

      console.log("");

      const fileContent = await executor.readFile(fileName);
      prompt = `
You are a senior software engineer.

The user asked:

"${goal}"

Below is the actual file.

========================================
${fileContent}
========================================

Explain:

1. What this file does
2. Important imports
3. Important functions
4. Key logic
5. How it fits into the project
6. Potential improvements

Use beginner-friendly language.
`;
    } else if (fileName && intent === "modify") {
      /**
       * ===============================================
       * MODIFY FILE
       * ===============================================
       */
      console.log(
        chalk.yellow("✏️ Preparing modification:"),
        chalk.whiteBright(fileName),
      );

      console.log("");

      const fileContent = await executor.readFile(fileName);

      prompt = `
You are a senior software engineer.

The user requested:

"${goal}"

Current file:

========================================
${fileContent}
========================================

IMPORTANT:

Return the COMPLETE updated file.

Do not explain anything.

Do not use markdown.

Do not use triple backticks.

Do not summarize.

Output must be the final file contents only.
`;
    } else if (targetFile && intent === "create") {
      /**
       * ===============================================
       * CREATE FILE
       * ===============================================
       */
      console.log(
        chalk.green("📄 Preparing file creation:"),
        chalk.whiteBright(targetFile),
      );

      console.log("");

     
    } else if (fileName && intent === "delete") {
      /**
       * ===============================================
       * DELETE FILE
       * ===============================================
       */
      console.log("");

      console.log(
        chalk.red("🗑 Staging deletion:"),
        chalk.whiteBright(fileName),
      );

      console.log("");

      await executor.deleteFile(fileName);

      const approved = await runApprovalFlow(tracker);

      if (approved) {
        await executor.applyApprovedFromTracker();
      }

      return agentContext;
    }

    const response = await generateResponse(prompt);

    console.log("");
    console.log(chalk.yellow("========== DEBUG =========="));
    console.log("Response Exists :", !!response?.trim());
    console.log("Response Length :", response?.length ?? 0);
    console.log("===========================");
    console.log("");

    /**
     * ===============================================
     * CREATE FILE
     * ===============================================
     */
    if (intent === "create" && targetFile && response?.trim()) {
      const fileContent = cleanAiFileResponse(response);

      console.log("");
      console.log(chalk.cyan("CREATE DEBUG"));
      console.log("intent     =", intent);
      console.log("targetFile =", targetFile);
      console.log("length     =", fileContent.length);
      console.log("");

      const parsed = JSON.parse(fileContent);

      for (const file of parsed.files) {
        await executor.createFile(file.path, file.content);

        console.log(chalk.green("✓ Staged:"), file.path);
      }


      console.log("");
      console.log("PENDING ACTIONS:", tracker.getPendingMutations().length);

      console.log("ALL ACTIONS:", tracker.getActions().length);

      console.log("");

      console.log(chalk.green("✓ File creation staged"));

      console.log(chalk.gray("Review and approve changes below."));

      console.log("");

      console.log(chalk.cyan("Preview (first 500 chars):"));

      console.log("");

      console.log(chalk.dim(fileContent.slice(0, 500)));

      console.log("");
    } else if (intent === "modify" && fileName && response?.trim()) {
      /**
       * ===============================================
       * MODIFY FILE
       * ===============================================
       */
      const updatedContent = cleanAiFileResponse(response);

      await executor.modifyFile(fileName, updatedContent);

      console.log("");

      console.log(chalk.green("✓ File modification staged"));

      console.log(chalk.gray("Review and approve changes below."));

      console.log("");

      console.log(chalk.cyan("Preview (first 500 chars):"));

      console.log("");

      console.log(chalk.dim(updatedContent.slice(0, 500)));

      console.log("");
    } else if (response?.trim()) {
      /**
       * ===============================================
       * NORMAL RESPONSE
       * ===============================================
       */
      console.log(chalk.white(response));

      console.log("");
    }
  } catch (error) {
    console.log("");

    console.log(chalk.red("Failed to generate AI response."));

    console.log(chalk.dim(error?.message ?? String(error)));

    console.log("");

    return;
  }
  /**
   * ===================================================
   * APPROVAL FLOW
   * ===================================================
   */

  console.log("");
  console.log(chalk.yellow("========== TRACKER =========="));
  console.log("Actions:", tracker.getActions().length);

  console.log("Pending:", tracker.getPendingMutations().length);

  console.log(tracker.getActions());
  console.log("=============================");
  console.log("");

  const approved = await runApprovalFlow(tracker);

  if (!approved) {
    console.log("");

    console.log(chalk.dim("No approved actions."));

    console.log("");

    return agentContext;
  }

  await executor.applyApprovedFromTracker();

  return agentContext;
}
