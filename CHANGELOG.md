# Changelog

All notable changes to AI Code Context will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-06-16

### Fixed

- Link issues in npm

## [1.0.1] - 2025-06-16

### Fixed

- Linter issues

## [1.0.0] - 2025-06-16

### Added

- 🎉 Initial release of AI Code Context
- 🤖 Support for OpenAI GPT-4 and GPT-3.5 models
- 🎭 Support for Anthropic Claude models
- 🏠 Support for local/self-hosted AI models (Ollama)
- 📊 Smart code analysis using git diffs
- 📝 Automatic documentation generation
- 🔗 Git integration with commit hooks
- 🎯 Language-agnostic code analysis
- ⚙️ Configurable analysis prompts and patterns
- 📋 Multiple output formats (Markdown, comments, both)
- 🚀 Simple CLI interface with interactive setup
- 📚 Comprehensive documentation and examples
- 🧪 Full test suite with high coverage
- 🔄 CI/CD pipeline with GitHub Actions

### CLI Commands

- `ai-context init` - Initialize project with interactive setup
- `ai-context analyze` - Analyze code changes with various options
- `ai-context watch` - Set up automatic analysis on commits
- `ai-context config` - Manage configuration settings
- `ai-context status` - Show project status and configuration

### Features

- **Smart Analysis**: Understands code context, purpose, and impact
- **Git Integration**: Analyzes commits, staged/unstaged changes
- **Auto-Documentation**: Updates README.md with analysis results
- **Flexible Configuration**: Customizable prompts and file patterns
- **Privacy Focused**: Option to use local AI models
- **Framework Support**: Includes examples for React, Python, Express.js
- **Error Handling**: Comprehensive error messages and validation

### Technical

- Built with TypeScript for type safety
- Commander.js for CLI interface
- simple-git for git operations
- axios for API communication
- Comprehensive test suite with Jest
- ESLint and Prettier for code quality
- GitHub Actions for CI/CD

## [1.0.3] - 2025-01-XX

### Fixed

- ✅ Fixed all security vulnerabilities (axios, form-data, glob, js-yaml)
- ✅ Replaced all `any` types with proper TypeScript types for better type safety
- ✅ Improved error handling with specific error messages for rate limits, authentication, and timeouts
- ✅ Fixed API key validation for local providers (now properly validates apiUrl)
- ✅ Fixed commit range parsing edge cases
- ✅ Added proper file existence and content validation
- ✅ Fixed test cases (Anthropic and Local provider model names)
- ✅ Improved error messages with actionable guidance

### Added

- ✅ Added API timeout handling (60s for OpenAI/Anthropic, 120s for local)
- ✅ Added proper API key validation with clear error messages
- ✅ Added connection error handling for local AI providers
- ✅ Added DEBUG environment variable support for detailed error stacks
- ✅ Enhanced error messages with specific guidance for common issues

### Improved

- ✅ Better TypeScript type safety throughout the codebase
- ✅ More robust error handling and validation
- ✅ Improved code quality and maintainability
- ✅ Enhanced production readiness

## [Unreleased]

### Planned

- VS Code extension integration
- Support for additional AI providers (Google PaLM, etc.)
- Batch analysis for large codebases
- Custom report templates
- Integration with popular IDEs
- Support for more programming languages
- Performance optimizations
- Enhanced git hook management
- Retry logic with exponential backoff for API failures
