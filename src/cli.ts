#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import { ConfigManager } from "./config";
import { RulesManager } from "./rules-manager";
import { SyncManager } from "./sync-manager";
import { CommandOptions } from "./types";

const program = new Command();

program
  .name("cursor-rules")
  .description("Share cursor rules and copilot instructions across teams and repos")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize cursor rules configuration in the current project")
  .option("--central-repo <url>", "Central repository URL for rules")
  .action(async (options) => {
    try {
      await initializeProject(options);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(chalk.red("Error during initialization:"), errorMessage);
      if (error instanceof Error && error.stack && process.env.DEBUG) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    }
  });

program
  .command("pull")
  .description("Pull rules from central repository")
  .option("--central-repo <url>", "Central repository URL (overrides config)")
  .option("--branch <branch>", "Branch to pull from", "main")
  .option("--force", "Force update even if files exist")
  .action(async (options) => {
    try {
      await pullRules(options);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(chalk.red("Error pulling rules:"), errorMessage);
      if (error instanceof Error && error.stack && process.env.DEBUG) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    }
  });

program
  .command("list")
  .description("List current rule files in the project")
  .action(async () => {
    try {
      await listRules();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(chalk.red("Error listing rules:"), errorMessage);
      process.exit(1);
    }
  });

program
  .command("show")
  .description("Show content of a rule file")
  .argument("<file>", "Path to rule file (e.g., .cursorrules)")
  .action(async (file) => {
    try {
      await showRule(file);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(chalk.red("Error showing rule:"), errorMessage);
      process.exit(1);
    }
  });

program
  .command("config")
  .description("Manage configuration")
  .option("--show", "Show current configuration")
  .option("--set <key=value>", "Set configuration value")
  .option("--reset", "Reset to default configuration")
  .action(async (options) => {
    try {
      await manageConfig(options);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(chalk.red("Error managing config:"), errorMessage);
      process.exit(1);
    }
  });

program
  .command("status")
  .description("Show project status and configuration")
  .action(async () => {
    try {
      await showStatus();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(chalk.red("Error showing status:"), errorMessage);
      process.exit(1);
    }
  });

async function initializeProject(options: CommandOptions): Promise<void> {
  console.log(chalk.blue("🔧 Initializing Cursor Rules..."));

  const configManager = new ConfigManager();
  const defaultConfig = configManager.get();
  let config: Partial<typeof defaultConfig> = {};

  if (!options.centralRepo) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "centralRepository",
        message: "Enter central repository URL (or press Enter to skip):",
        default: "",
      },
      {
        type: "input",
        name: "rulesPath",
        message: "Path for cursor rules file:",
        default: ".cursorrules",
      },
      {
        type: "input",
        name: "copilotInstructionsPath",
        message: "Path for copilot instructions file:",
        default: ".github/copilot-instructions.md",
      },
      {
        type: "confirm",
        name: "autoSync",
        message: "Enable automatic sync on git pull?",
        default: false,
      },
    ]);

    config = answers;
  } else {
    config = {
      centralRepository: options.centralRepo,
    };
  }

  await configManager.save(config);

  console.log(chalk.green("✓ Cursor Rules initialized successfully!"));
  console.log(chalk.blue("\nNext steps:"));
  console.log('  1. Run "cursor-rules pull" to sync rules from central repository');
  console.log('  2. Run "cursor-rules status" to check your setup');
  console.log('  3. Run "cursor-rules list" to see current rule files');
}

interface PullOptions extends CommandOptions {
  branch?: string;
  force?: boolean;
}

async function pullRules(options: PullOptions): Promise<void> {
  const spinner = ora("Pulling rules from central repository...").start();

  try {
    const configManager = new ConfigManager();
    const config = await configManager.load();

    const repositoryUrl = options.centralRepo || config.centralRepository;
    if (!repositoryUrl) {
      spinner.fail("No central repository configured");
      console.error(
        chalk.red(
          "Please set central repository URL using --central-repo or run 'cursor-rules init'"
        )
      );
      return;
    }

    spinner.text = `Cloning repository: ${repositoryUrl}`;
    const syncManager = new SyncManager();
    const rules = await syncManager.pullFromRepository(
      repositoryUrl,
      options.branch || "main"
    );

    if (rules.length === 0) {
      spinner.warn("No rule files found in repository");
      return;
    }

    spinner.text = `Syncing ${rules.length} rule file(s)...`;
    const rulesManager = new RulesManager();
    const result = await rulesManager.syncRules(rules, options.force || false);

    spinner.succeed("Rules synced successfully!");

    if (result.filesCreated.length > 0) {
      console.log(chalk.green(`\n✓ Created ${result.filesCreated.length} file(s):`));
      result.filesCreated.forEach((file) => {
        console.log(chalk.gray(`   + ${file}`));
      });
    }

    if (result.filesUpdated.length > 0) {
      console.log(chalk.yellow(`\n✓ Updated ${result.filesUpdated.length} file(s):`));
      result.filesUpdated.forEach((file) => {
        console.log(chalk.gray(`   ~ ${file}`));
      });
    }

    if (result.errors.length > 0) {
      console.log(chalk.red(`\n✗ ${result.errors.length} error(s):`));
      result.errors.forEach((error) => {
        console.log(chalk.gray(`   ${error}`));
      });
    }
  } catch (error) {
    spinner.fail("Failed to pull rules");
    throw error;
  }
}

async function listRules(): Promise<void> {
  const rulesManager = new RulesManager();
  const files = await rulesManager.listRuleFiles();

  if (files.length === 0) {
    console.log(chalk.yellow("No rule files found in this project"));
    return;
  }

  console.log(chalk.blue("Rule files in this project:\n"));
  for (const file of files) {
    const content = await rulesManager.getRuleFileContent(file);
    const size = content ? `${content.length} bytes` : "empty";
    console.log(`  ${chalk.green("✓")} ${file} ${chalk.gray(`(${size})`)}`);
  }
}

async function showRule(filePath: string): Promise<void> {
  const rulesManager = new RulesManager();
  const content = await rulesManager.getRuleFileContent(filePath);

  if (!content) {
    console.error(chalk.red(`File not found: ${filePath}`));
    return;
  }

  console.log(chalk.blue(`\nContent of ${filePath}:\n`));
  console.log(content);
}

async function manageConfig(options: CommandOptions): Promise<void> {
  const configManager = new ConfigManager();

  if (options.show) {
    const config = await configManager.load();
    console.log(chalk.blue("Current configuration:"));
    console.log(JSON.stringify(config, null, 2));
    return;
  }

  if (options.set) {
    const [key, value] = options.set.split("=");
    if (!key || !value) {
      console.error(chalk.red("Error: Please provide key=value format"));
      return;
    }

    const updates: Record<string, unknown> = {};
    updates[key] = value;
    await configManager.save(updates);
    console.log(chalk.green(`✓ Configuration updated: ${key} = ${value}`));
    return;
  }

  if (options.reset) {
    await configManager.createDefaultConfig();
    console.log(chalk.green("✓ Configuration reset to defaults"));
    return;
  }

  console.log(chalk.blue("Configuration management:"));
  console.log("  --show          Show current configuration");
  console.log("  --set key=value Set a configuration value");
  console.log("  --reset         Reset to default configuration");
}

async function showStatus(): Promise<void> {
  console.log(chalk.blue("🔧 Cursor Rules Status\n"));

  const configManager = new ConfigManager();
  const rulesManager = new RulesManager();

  const config = await configManager.load();
  const validation = await configManager.validateConfig();

  console.log(
    `Configuration: ${
      validation.valid ? chalk.green("✓ Valid") : chalk.red("✗ Invalid")
    }`
  );
  console.log(
    `Central Repository: ${
      config.centralRepository
        ? chalk.green(config.centralRepository)
        : chalk.yellow("Not configured")
    }`
  );
  console.log(`Rules Path: ${chalk.yellow(config.rulesPath)}`);
  console.log(
    `Copilot Instructions: ${chalk.yellow(config.copilotInstructionsPath)}`
  );
  console.log(`Auto Sync: ${config.autoSync ? chalk.green("Enabled") : chalk.yellow("Disabled")}`);

  if (!validation.valid) {
    console.log(chalk.red("\nConfiguration Issues:"));
    validation.errors.forEach((error) =>
      console.log(chalk.red(`  • ${error}`))
    );
  }

  const ruleFiles = await rulesManager.listRuleFiles();
  console.log(`\nRule Files: ${chalk.yellow(ruleFiles.length.toString())}`);
  if (ruleFiles.length > 0) {
    ruleFiles.forEach((file) => {
      console.log(chalk.gray(`  • ${file}`));
    });
  }

  console.log(chalk.blue("\nReady to sync rules! 🚀"));
}

// Error handling
process.on("unhandledRejection", (error: unknown) => {
  const errorMessage =
    error instanceof Error ? error.message : "Unknown unhandled rejection";
  console.error(chalk.red("Unhandled error:"), errorMessage);
  if (error instanceof Error && error.stack && process.env.DEBUG) {
    console.error(chalk.gray(error.stack));
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log(chalk.yellow("\nOperation cancelled by user"));
  process.exit(0);
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
