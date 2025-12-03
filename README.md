# 🔧 Cursor Rules Sync

> Share cursor rules and copilot instructions across teams and repos from a central place

[![npm version](https://badge.fury.io/js/cursor-rules-sync.svg)](https://badge.fury.io/js/cursor-rules-sync)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## The Problem

Teams working across multiple repositories struggle to maintain consistent cursor rules and GitHub Copilot instructions. Manually copying `.cursorrules` files and copilot instructions to each repository is error-prone and time-consuming.

## The Solution

**Cursor Rules Sync** provides a simple CLI tool to sync cursor rules and copilot instructions from a central repository to all your projects. Keep your team's coding standards and AI assistant instructions consistent across all repositories.

## ✨ Features

- 🔄 **Centralized Rules** - Store all cursor rules and copilot instructions in one repository
- 🚀 **Easy Sync** - Pull rules into any repository with a single command
- 🎯 **Multiple File Support** - Sync `.cursorrules`, copilot instructions, and custom rule files
- 🔗 **Git Integration** - Pull from any Git repository (GitHub, GitLab, Bitbucket, etc.)
- ⚙️ **Configurable** - Customize file paths and sync behavior
- 🚫 **No API Keys** - No external services or API keys required
- 📦 **Zero Dependencies** - Works with just Git

## 🚀 Quick Start

### Prerequisites

- Node.js 16.0.0 or higher
- Git installed and configured

### Installation

```bash
npm install -g cursor-rules-sync
```

### Initialize in your project

```bash
cd your-project
cursor-rules init
```

Follow the prompts to configure your central repository URL.

### Pull rules from central repository

```bash
cursor-rules pull
```

This will clone the central repository and sync all rule files to your current project.

## 📖 Usage Examples

### Basic Usage

```bash
# Initialize configuration
cursor-rules init

# Pull rules from central repository
cursor-rules pull

# List current rule files
cursor-rules list

# Show content of a rule file
cursor-rules show .cursorrules

# Check status
cursor-rules status
```

### Advanced Usage

```bash
# Pull from a specific repository (overrides config)
cursor-rules pull --central-repo https://github.com/your-org/rules-repo

# Pull from a specific branch
cursor-rules pull --branch develop

# Force update even if files exist
cursor-rules pull --force

# Configure settings
cursor-rules config --set centralRepository=https://github.com/your-org/rules-repo
cursor-rules config --show
```

## 🏗️ Setting Up a Central Repository

1. **Create a repository** for your team's cursor rules:

```bash
mkdir team-cursor-rules
cd team-cursor-rules
git init
```

2. **Add your rule files**:

```bash
# Add .cursorrules file
echo "# Your cursor rules here" > .cursorrules

# Add copilot instructions
mkdir -p .github
echo "# Your copilot instructions here" > .github/copilot-instructions.md

git add .
git commit -m "Add cursor rules and copilot instructions"
git remote add origin https://github.com/your-org/team-cursor-rules.git
git push -u origin main
```

3. **Share the repository URL** with your team

4. **Team members sync** in their projects:

```bash
cursor-rules init --central-repo https://github.com/your-org/team-cursor-rules
cursor-rules pull
```

## 📋 Configuration

Create `.cursorrules-config.json` in your project root:

```json
{
  "centralRepository": "https://github.com/your-org/team-cursor-rules",
  "rulesPath": ".cursorrules",
  "copilotInstructionsPath": ".github/copilot-instructions.md",
  "autoSync": false,
  "includePatterns": ["**/.cursorrules", "**/.github/copilot-instructions.md"],
  "excludePatterns": ["node_modules/**", "dist/**", ".git/**"]
}
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `centralRepository` | Git repository URL containing rules | `""` |
| `rulesPath` | Path for cursor rules file | `.cursorrules` |
| `copilotInstructionsPath` | Path for copilot instructions | `.github/copilot-instructions.md` |
| `autoSync` | Auto-sync on git pull (future feature) | `false` |
| `includePatterns` | File patterns to include | `["**/.cursorrules", ...]` |
| `excludePatterns` | File patterns to exclude | `["node_modules/**", ...]` |

## 🔧 Commands

### `cursor-rules init`

Initialize cursor rules configuration in the current project.

```bash
cursor-rules init [options]

Options:
  --central-repo <url>  Central repository URL for rules
```

### `cursor-rules pull`

Pull rules from central repository and sync to current project.

```bash
cursor-rules pull [options]

Options:
  --central-repo <url>  Central repository URL (overrides config)
  --branch <branch>     Branch to pull from (default: main)
  --force               Force update even if files exist
```

### `cursor-rules list`

List all rule files currently in the project.

```bash
cursor-rules list
```

### `cursor-rules show`

Show content of a specific rule file.

```bash
cursor-rules show <file>

Example:
  cursor-rules show .cursorrules
```

### `cursor-rules config`

Manage configuration settings.

```bash
cursor-rules config [options]

Options:
  --show          Show current configuration
  --set <key=value> Set configuration value
  --reset         Reset to default configuration
```

### `cursor-rules status`

Show project status and configuration.

```bash
cursor-rules status
```

## 🏢 Enterprise Usage

### Multiple Teams

Different teams can have their own central repositories:

```bash
# Frontend team
cursor-rules init --central-repo https://github.com/company/frontend-rules

# Backend team
cursor-rules init --central-repo https://github.com/company/backend-rules
```

### Private Repositories

Works with private repositories using SSH:

```bash
cursor-rules init --central-repo git@github.com:company/private-rules.git
```

Or with HTTPS and authentication:

```bash
# Git will prompt for credentials
cursor-rules pull --central-repo https://github.com/company/private-rules.git
```

## 🔄 Git Integration

### Pre-commit Hook (Optional)

You can set up a pre-commit hook to ensure rules are always up to date:

```bash
# .git/hooks/pre-commit
#!/bin/sh
cursor-rules pull --force
```

### CI/CD Integration

Add to your CI pipeline to ensure rules are synced:

```yaml
# .github/workflows/sync-rules.yml
name: Sync Cursor Rules
on:
  schedule:
    - cron: '0 0 * * *'  # Daily
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g cursor-rules-sync
      - run: cursor-rules pull
      - run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add .cursorrules .github/copilot-instructions.md
          git diff --staged --quiet || git commit -m "chore: sync cursor rules"
          git push
```

## 📁 File Structure

The tool looks for rule files in common locations:

- `.cursorrules` - Cursor IDE rules
- `.github/copilot-instructions.md` - GitHub Copilot instructions
- `cursorrules` - Alternative location
- `copilot-instructions.md` - Alternative location
- `rules/.cursorrules` - Rules directory
- `rules/copilot-instructions.md` - Rules directory

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/mucahitgurbuz/cursor-rules-sync.git
cd cursor-rules-sync
npm install
npm run build
npm link
```

### Running Tests

```bash
npm test
npm run test:coverage
```

## 🔧 Troubleshooting

### "No central repository configured"

Set the central repository URL:

```bash
cursor-rules config --set centralRepository=https://github.com/your-org/rules-repo
```

Or use the `--central-repo` flag:

```bash
cursor-rules pull --central-repo https://github.com/your-org/rules-repo
```

### "Failed to pull from repository"

- Verify the repository URL is correct
- Check that you have access to the repository
- For private repos, ensure your Git credentials are configured
- Try using SSH URL instead of HTTPS: `git@github.com:org/repo.git`

### "No rule files found in repository"

The tool looks for files named:
- `.cursorrules`
- Files containing `copilot-instructions` in the name
- Files ending with `.cursorrules`

Make sure your central repository contains at least one of these files.

## 📊 Benefits

- **Consistency** - Same rules across all repositories
- **Time Saving** - No manual copying of rule files
- **Easy Updates** - Update once, sync everywhere
- **Team Alignment** - Everyone uses the same coding standards
- **Version Control** - Track changes to rules over time
- **No External Dependencies** - Works with just Git

## 🛡️ Privacy & Security

- **No External Services** - Everything works with Git repositories
- **No API Keys** - No authentication tokens or API keys required
- **Local Processing** - All operations happen locally
- **Git Security** - Uses your existing Git authentication

## 📄 License

MIT © [Cursor Rules Sync Contributors](LICENSE)

## 🙋‍♂️ Support

- 📚 [Documentation](https://github.com/mucahitgurbuz/cursor-rules-sync/wiki)
- 🐛 [Issue Tracker](https://github.com/mucahitgurbuz/cursor-rules-sync/issues)
- 💬 [Discussions](https://github.com/mucahitgurbuz/cursor-rules-sync/discussions)

---

**Made with ❤️ for teams who want consistent coding standards across all their repositories.**
