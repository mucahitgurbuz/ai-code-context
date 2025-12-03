import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";
import simpleGit, { SimpleGit } from "simple-git";
import { RuleFile } from "./types";

export class SyncManager {
  private tempDir: string;
  private git?: SimpleGit;

  constructor() {
    this.tempDir = path.join(os.tmpdir(), "cursor-rules-sync");
  }

  async pullFromRepository(
    repositoryUrl: string,
    branch: string = "main"
  ): Promise<RuleFile[]> {
    const cloneDir = path.join(this.tempDir, Date.now().toString());

    try {
      // Clone or update repository
      if (await fs.pathExists(cloneDir)) {
        this.git = simpleGit(cloneDir);
        await this.git.pull();
      } else {
        await fs.ensureDir(cloneDir);
        this.git = simpleGit();
        await this.git.clone(repositoryUrl, cloneDir, ["--depth", "1", "--branch", branch]);
        this.git = simpleGit(cloneDir);
      }

      // Checkout specific branch
      try {
        await this.git.checkout(branch);
      } catch {
        // Branch might not exist, use default
      }

      // Find and read rule files
      const rules: RuleFile[] = [];

      // Look for common rule file locations
      const ruleFilePaths = [
        ".cursorrules",
        ".github/copilot-instructions.md",
        "cursorrules",
        "copilot-instructions.md",
        "rules/.cursorrules",
        "rules/copilot-instructions.md",
      ];

      for (const rulePath of ruleFilePaths) {
        const fullPath = path.join(cloneDir, rulePath);
        if (await fs.pathExists(fullPath)) {
          const content = await fs.readFile(fullPath, "utf-8");
          const type = rulePath.includes("copilot")
            ? "copilot-instructions"
            : rulePath.includes("cursorrules")
            ? "cursorrules"
            : "custom";

          rules.push({
            path: rulePath,
            content,
            type,
          });
        }
      }

      // Also search for any .cursorrules files recursively
      const allFiles = await this.findAllRuleFiles(cloneDir);
      for (const filePath of allFiles) {
        const relativePath = path.relative(cloneDir, filePath);
        if (!rules.find((r) => r.path === relativePath)) {
          const content = await fs.readFile(filePath, "utf-8");
          const type = this.detectRuleType(filePath);
          rules.push({
            path: relativePath,
            content,
            type,
          });
        }
      }

      return rules;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to pull from repository: ${errorMessage}`);
    } finally {
      // Cleanup temp directory after a delay (in case of concurrent requests)
      setTimeout(async () => {
        try {
          if (await fs.pathExists(cloneDir)) {
            await fs.remove(cloneDir);
          }
        } catch {
          // Ignore cleanup errors
        }
      }, 60000); // Clean up after 1 minute
    }
  }

  private async findAllRuleFiles(rootDir: string): Promise<string[]> {
    const files: string[] = [];

    async function searchDir(dir: string): Promise<void> {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          // Skip common ignore patterns
          if (
            entry.name.startsWith(".") &&
            entry.name !== ".cursorrules" &&
            entry.name !== ".github"
          ) {
            continue;
          }
          
          if (entry.isDirectory() && !entry.name.includes("node_modules")) {
            await searchDir(fullPath);
          } else if (entry.isFile()) {
            const name = entry.name.toLowerCase();
            if (
              name === ".cursorrules" ||
              name.includes("copilot-instructions") ||
              name.endsWith(".cursorrules")
            ) {
              files.push(fullPath);
            }
          }
        }
      } catch {
        // Ignore errors when searching
      }
    }

    await searchDir(rootDir);
    return files;
  }

  private detectRuleType(filePath: string): "cursorrules" | "copilot-instructions" | "custom" {
    const lowerPath = filePath.toLowerCase();
    if (lowerPath.includes("copilot")) {
      return "copilot-instructions";
    }
    if (lowerPath.includes("cursorrules") || lowerPath.endsWith(".cursorrules")) {
      return "cursorrules";
    }
    return "custom";
  }
}
