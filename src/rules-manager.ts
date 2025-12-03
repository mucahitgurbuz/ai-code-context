import * as fs from "fs-extra";
import * as path from "path";
import { RuleFile, SyncResult } from "./types";

export class RulesManager {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  async readRuleFile(filePath: string): Promise<string | null> {
    const fullPath = path.join(this.projectRoot, filePath);
    try {
      if (await fs.pathExists(fullPath)) {
        return await fs.readFile(fullPath, "utf-8");
      }
    } catch (error) {
      // File doesn't exist or can't be read
    }
    return null;
  }

  async writeRuleFile(filePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.projectRoot, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content, "utf-8");
  }

  async syncRules(
    rules: RuleFile[],
    force: boolean = false
  ): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      filesUpdated: [],
      filesCreated: [],
      errors: [],
    };

    for (const rule of rules) {
      try {
        const existingContent = await this.readRuleFile(rule.path);
        const shouldUpdate = force || !existingContent || existingContent !== rule.content;

        if (shouldUpdate) {
          await this.writeRuleFile(rule.path, rule.content);
          if (existingContent) {
            result.filesUpdated.push(rule.path);
          } else {
            result.filesCreated.push(rule.path);
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        result.errors.push(`Failed to sync ${rule.path}: ${errorMessage}`);
        result.success = false;
      }
    }

    return result;
  }

  async listRuleFiles(): Promise<string[]> {
    const files: string[] = [];
    const commonPaths = [
      ".cursorrules",
      ".github/copilot-instructions.md",
      ".cursor/rules.md",
      "docs/copilot-instructions.md",
    ];

    for (const filePath of commonPaths) {
      const fullPath = path.join(this.projectRoot, filePath);
      if (await fs.pathExists(fullPath)) {
        files.push(filePath);
      }
    }

    return files;
  }

  async getRuleFileContent(filePath: string): Promise<string | null> {
    return this.readRuleFile(filePath);
  }
}
