import { ConfigManager } from "../src/config";
import * as fs from "fs-extra";
import * as path from "path";

// Mock fs-extra
jest.mock("fs-extra");
const mockFs = fs as jest.Mocked<typeof fs>;

describe("ConfigManager", () => {
  let configManager: ConfigManager;
  let tempConfigPath: string;

  beforeEach(() => {
    configManager = new ConfigManager("/tmp/test-project");
    tempConfigPath = path.join("/tmp/test-project", ".cursorrules-config.json");
    jest.clearAllMocks();
  });

  describe("load", () => {
    it("should load default config when no config file exists", async () => {
      (mockFs.pathExists as jest.Mock).mockResolvedValue(false);

      const config = await configManager.load();

      expect(config.centralRepository).toBe("");
      expect(config.rulesPath).toBe(".cursorrules");
      expect(config.autoSync).toBe(false);
    });

    it("should merge user config with defaults", async () => {
      const userConfig = {
        centralRepository: "https://github.com/org/rules-repo",
        rulesPath: ".custom-rules",
        autoSync: true,
      };

      (mockFs.pathExists as jest.Mock).mockResolvedValue(true);
      (mockFs.readJson as jest.Mock).mockResolvedValue(userConfig);

      const config = await configManager.load();

      expect(config.centralRepository).toBe("https://github.com/org/rules-repo");
      expect(config.rulesPath).toBe(".custom-rules");
      expect(config.autoSync).toBe(true);
      expect(config.copilotInstructionsPath).toBe(".github/copilot-instructions.md"); // Should retain default
    });

    it("should handle corrupted config file gracefully", async () => {
      (mockFs.pathExists as jest.Mock).mockResolvedValue(true);
      (mockFs.readJson as jest.Mock).mockRejectedValue(new Error("Invalid JSON"));

      const config = await configManager.load();

      expect(config.centralRepository).toBe(""); // Should use defaults
    });
  });

  describe("save", () => {
    it("should save config to file", async () => {
      const updates = {
        centralRepository: "https://github.com/org/rules-repo",
        rulesPath: ".custom-rules",
      };

      await configManager.save(updates);

      expect(mockFs.ensureFile).toHaveBeenCalledWith(tempConfigPath);
      expect(mockFs.writeJson).toHaveBeenCalledWith(
        tempConfigPath,
        expect.objectContaining(updates),
        { spaces: 2 }
      );
    });
  });

  describe("validateConfig", () => {
    beforeEach(async () => {
      await configManager.load();
    });

    it("should return valid for proper config", async () => {
      configManager.get().centralRepository = "https://github.com/org/repo";

      const validation = await configManager.validateConfig();

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("should detect invalid repository URL", async () => {
      configManager.get().centralRepository = "not-a-valid-url";

      const validation = await configManager.validateConfig();

      expect(validation.valid).toBe(false);
      expect(validation.errors[0]).toContain("must be a valid Git repository URL");
    });

    it("should accept valid repository URLs", async () => {
      const validUrls = [
        "https://github.com/org/repo",
        "http://github.com/org/repo",
        "git@github.com:org/repo.git",
        "git://github.com/org/repo.git",
      ];

      for (const url of validUrls) {
        configManager.get().centralRepository = url;
        const validation = await configManager.validateConfig();
        expect(validation.valid).toBe(true);
      }
    });
  });
});
