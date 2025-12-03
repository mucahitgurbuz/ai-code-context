import * as fs from "fs-extra";
import * as path from "path";

const DEFAULT_CONFIG = {
  centralRepository: "",
  rulesPath: ".cursorrules",
  copilotInstructionsPath: ".github/copilot-instructions.md",
  autoSync: false,
  includePatterns: ["**/.cursorrules", "**/.github/copilot-instructions.md"],
  excludePatterns: ["node_modules/**", "dist/**", ".git/**"],
};

export class ConfigManager {
  private configPath: string;
  private config: typeof DEFAULT_CONFIG;

  constructor(projectRoot: string = process.cwd()) {
    this.configPath = path.join(projectRoot, ".cursorrules-config.json");
    this.config = { ...DEFAULT_CONFIG };
  }

  async load(): Promise<typeof DEFAULT_CONFIG> {
    try {
      if (await fs.pathExists(this.configPath)) {
        const userConfig = await fs.readJson(this.configPath);
        this.config = { ...DEFAULT_CONFIG, ...userConfig };
      }
    } catch (error) {
      console.warn("Warning: Could not load config file, using defaults");
    }
    return this.config;
  }

  async save(config: Partial<typeof DEFAULT_CONFIG>): Promise<void> {
    this.config = { ...this.config, ...config };
    await fs.ensureFile(this.configPath);
    await fs.writeJson(this.configPath, this.config, { spaces: 2 });
  }

  get(): typeof DEFAULT_CONFIG {
    return this.config;
  }

  async createDefaultConfig(): Promise<void> {
    await fs.ensureFile(this.configPath);
    await fs.writeJson(this.configPath, DEFAULT_CONFIG, { spaces: 2 });
  }

  async validateConfig(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const config = this.get();

    if (config.centralRepository && !this.isValidRepositoryUrl(config.centralRepository)) {
      errors.push("centralRepository must be a valid Git repository URL");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private isValidRepositoryUrl(url: string): boolean {
    return (
      url.startsWith("https://") ||
      url.startsWith("http://") ||
      url.startsWith("git@") ||
      url.startsWith("git://")
    );
  }
}
