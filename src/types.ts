export interface RulesConfig {
  centralRepository?: string;
  rulesPath?: string;
  copilotInstructionsPath?: string;
  autoSync?: boolean;
  includePatterns?: string[];
  excludePatterns?: string[];
}

export interface CommandOptions {
  centralRepo?: string;
  rulesPath?: string;
  copilotPath?: string;
  force?: boolean;
  show?: boolean;
  set?: string;
  reset?: boolean;
}

export interface RuleFile {
  path: string;
  content: string;
  type: "cursorrules" | "copilot-instructions" | "custom";
}

export interface SyncResult {
  success: boolean;
  filesUpdated: string[];
  filesCreated: string[];
  errors: string[];
}
