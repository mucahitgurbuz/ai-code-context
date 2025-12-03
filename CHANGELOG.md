# Changelog

All notable changes to Cursor Rules Sync will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Added

- 🎉 Initial release of Cursor Rules Sync
- 🔄 Pull cursor rules and copilot instructions from central Git repository
- 📋 Support for multiple rule file types (`.cursorrules`, copilot instructions)
- ⚙️ Configuration management via `.cursorrules-config.json`
- 📝 List and show rule files in current project
- 🔍 Status command to check configuration and rule files
- 🚀 Easy initialization with interactive prompts
- 🔗 Support for GitHub, GitLab, Bitbucket, and any Git repository
- 📦 No external dependencies or API keys required

### CLI Commands

- `cursor-rules init` - Initialize project with central repository configuration
- `cursor-rules pull` - Pull and sync rules from central repository
- `cursor-rules list` - List all rule files in current project
- `cursor-rules show <file>` - Show content of a specific rule file
- `cursor-rules config` - Manage configuration settings
- `cursor-rules status` - Show project status and configuration

### Features

- **Centralized Rules**: Store all cursor rules in one repository
- **Easy Sync**: Pull rules into any project with a single command
- **Multiple File Support**: Sync `.cursorrules`, copilot instructions, and custom files
- **Git Integration**: Works with any Git repository
- **Configurable**: Customize file paths and sync behavior
- **No API Keys**: No external services required
- **Zero Dependencies**: Works with just Git

### Technical

- Built with TypeScript for type safety
- Commander.js for CLI interface
- simple-git for Git operations
- Comprehensive test suite with Jest
- ESLint for code quality
- GitHub Actions for CI/CD

## [Unreleased]

### Planned

- Auto-sync on git pull
- Watch mode for automatic syncing
- Support for multiple central repositories
- Rule file merging strategies
- Conflict resolution for rule updates
- Rule file templates
- Integration with package.json scripts
- Support for encrypted rule files
