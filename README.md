# 🤖 AI Code Context

> AI-powered code documentation that actually helps developers understand and maintain code

[![npm version](https://badge.fury.io/js/ai-code-context.svg)](https://badge.fury.io/js/ai-code-context)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/mucahitgurbuz/ai-code-context/actions/workflows/ci.yml/badge.svg)](https://github.com/mucahitgurbuz/ai-code-context/actions/workflows/ci.yml)

## The Problem

Developers spend **30%+ of their time** understanding existing code and writing documentation. When working on unfamiliar codebases or returning to old projects, developers waste hours figuring out what code does and why it was written that way.

## The Solution

**AI Code Context** automatically generates and maintains contextual documentation for your code changes using AI. It integrates seamlessly into your git workflow and provides human-readable explanations that actually help developers understand code faster.

## ✨ Features

- 🔍 **Smart Code Analysis** - Analyzes git diffs and understands code changes in context
- 📝 **Auto-Documentation** - Generates clear, helpful documentation automatically
- 🔗 **Git Integration** - Hooks into your git workflow for seamless analysis
- 🧠 **Multiple AI Providers** - Works with OpenAI, Anthropic, or local models
- 🎯 **Language Agnostic** - Supports any programming language
- 🚀 **Zero Config** - Works out of the box with sensible defaults
- 🔐 **Privacy Focused** - Option to use local AI models

## 🚀 Quick Start

### Prerequisites

- Node.js 16.0.0 or higher
- Git repository initialized in your project
- API key for your chosen AI provider (OpenAI, Anthropic, or local AI setup)

### Installation

```bash
npm install -g ai-code-context
```

### Initialize in your project

```bash
cd your-project
ai-context init
```

### Analyze your code

```bash
# Analyze recent changes
ai-context analyze --commit HEAD~1..HEAD

# Analyze staged changes before committing
ai-context analyze --staged

# Analyze specific file
ai-context analyze --file src/components/UserProfile.tsx

# Set up automatic analysis on commits
ai-context watch --install-hook
```

## 📖 Usage Examples

### Analyzing Git Commits

```bash
# Analyze the last commit
ai-context analyze --commit HEAD~1..HEAD

# Analyze a range of commits
ai-context analyze --commit feature-branch..main

# Analyze uncommitted changes
ai-context analyze --unstaged
```

### Example Output

```markdown
# Code Analysis Report

**Project:** my-react-app
**Type:** React Application
**Languages:** typescript, javascript
**Generated:** 2024-01-15T10:30:00.000Z

## Summary

Analyzed 3 file(s) with AI-powered code analysis.

### src/components/UserProfile.tsx

**Language:** typescript

**Summary:** Added new user profile component with avatar display and edit functionality

**Purpose:** Create a reusable user profile component for displaying user information with editing capabilities

**Key Changes:**

- Implemented UserProfile React component with TypeScript
- Added avatar image display with fallback to initials
- Integrated edit mode toggle for profile information
- Added form validation for email and username fields

**Impact:** Enables user profile functionality across the application with consistent UI/UX

**Suggestions:**

- Consider adding loading states for async operations
- Add unit tests for form validation logic
- Consider extracting avatar logic into separate component for reusability
```

### Configuration

Create `.aicontext.json` in your project root:

```json
{
  "aiProvider": "openai",
  "model": "gpt-4",
  "apiKey": "your-api-key-here",
  "maxTokens": 2000,
  "temperature": 0.3,
  "autoCommitHook": true,
  "includePatterns": ["**/*.js", "**/*.ts", "**/*.tsx", "**/*.py"],
  "excludePatterns": ["node_modules/**", "dist/**", "**/*.test.*"],
  "outputFormat": "both",
  "updateReadme": true
}
```

## 🎛️ Configuration Options

| Option            | Description                                   | Default                       |
| ----------------- | --------------------------------------------- | ----------------------------- |
| `aiProvider`      | AI provider: `openai`, `anthropic`, `local`   | `openai`                      |
| `model`           | AI model to use                               | `gpt-4`                       |
| `apiKey`          | API key for AI provider                       | env var                       |
| `maxTokens`       | Maximum tokens per request                    | `2000`                        |
| `temperature`     | AI creativity (0-1)                           | `0.3`                         |
| `autoCommitHook`  | Auto-analyze on commits                       | `false`                       |
| `includePatterns` | Files to analyze                              | `["**/*.js", "**/*.ts", ...]` |
| `excludePatterns` | Files to ignore                               | `["node_modules/**", ...]`    |
| `outputFormat`    | Output format: `markdown`, `comments`, `both` | `both`                        |
| `updateReadme`    | Auto-update README.md                         | `true`                        |

## 🧠 AI Provider Setup

### OpenAI

```bash
export OPENAI_API_KEY="your-api-key"
ai-context init --provider openai --model gpt-4
```

### Anthropic (Claude)

```bash
export ANTHROPIC_API_KEY="your-api-key"
ai-context init --provider anthropic --model claude-3-sonnet-20240229
```

### Local/Self-hosted (Ollama)

```bash
# Start Ollama server
ollama serve

# Configure AI Code Context
ai-context init --provider local --model llama2 --api-url http://localhost:11434/api/chat
```

**Note**: For local providers, you must specify the `apiUrl` in your configuration. The default is `http://localhost:11434/api/chat` for Ollama.

## 🔧 Commands

### `ai-context init`

Initialize AI Code Context in your project. This creates a `.aicontext.json` configuration file.

```bash
ai-context init [options]

Options:
  --provider <provider>  AI provider (openai, anthropic, local)
  --model <model>       AI model to use
  --api-key <key>       API key for the AI provider (optional, can be set via env var)
  --api-url <url>       API URL for local providers (required for local)
```

**Examples:**
```bash
# Interactive setup
ai-context init

# Quick setup with OpenAI
ai-context init --provider openai --model gpt-4

# Setup with environment variable
export OPENAI_API_KEY="your-key"
ai-context init --provider openai
```

### `ai-context analyze`

Analyze code changes and generate documentation.

```bash
ai-context analyze [options]

Options:
  --commit <range>   Analyze specific commit range (e.g., HEAD~1..HEAD)
  --staged          Analyze staged changes
  --unstaged        Analyze unstaged changes
  --file <path>     Analyze specific file
  --output <path>   Output file for the analysis report
  --auto           Auto mode for git hooks (minimal output)
```

**Error Handling:**
- If API rate limits are exceeded, you'll get a clear error message
- Authentication errors provide guidance on checking your API key
- Timeout errors suggest retrying or using a smaller code change
- Connection errors for local providers help diagnose service issues

**Debug Mode:**
Set `DEBUG=1` environment variable for detailed error stacks:
```bash
DEBUG=1 ai-context analyze --staged
```

### `ai-context watch`

Set up automatic analysis on git commits.

```bash
ai-context watch [options]

Options:
  --install-hook    Install git commit hook
  --remove-hook     Remove git commit hook
```

### `ai-context config`

Manage configuration.

```bash
ai-context config [options]

Options:
  --show           Show current configuration
  --set <key=value> Set configuration value
  --reset          Reset to default configuration
```

### `ai-context status`

Show project status and configuration.

```bash
ai-context status
```

## 🔄 Git Integration

### Automatic Analysis on Commits

Install the git hook to automatically analyze commits:

```bash
ai-context watch --install-hook
```

This creates a `post-commit` hook that runs `ai-context analyze --commit HEAD~1..HEAD --auto` after each commit.

### Pre-commit Analysis

Add to your `.git/hooks/pre-commit`:

```bash
#!/bin/sh
ai-context analyze --staged
```

## 🏗️ Integration Examples

### GitHub Actions

```yaml
name: AI Code Analysis
on: [pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install -g ai-code-context
      - run: ai-context analyze --commit ${{ github.event.pull_request.base.sha }}..${{ github.event.pull_request.head.sha }}
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

### VS Code Extension

Install the AI Code Context VS Code extension for integrated analysis:

```bash
code --install-extension ai-code-context.vscode-extension
```

### Package.json Scripts

```json
{
  "scripts": {
    "analyze": "ai-context analyze --staged",
    "analyze:last": "ai-context analyze --commit HEAD~1..HEAD",
    "analyze:branch": "ai-context analyze --commit main..HEAD"
  }
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/mucahitgurbuz/ai-code-context.git
cd ai-code-context
npm install
npm run build
npm link
```

### Running Tests

```bash
npm test
npm run test:coverage
```

## 📊 Benefits

- **Save 2-3 hours per week** on documentation tasks
- **Faster onboarding** for new team members
- **Better code reviews** with AI-generated context
- **Improved maintainability** with up-to-date documentation
- **Language agnostic** - works with any codebase
- **Privacy focused** - option for local AI processing
- **Production ready** - comprehensive error handling and validation
- **Type safe** - full TypeScript support for reliability

## 🛡️ Privacy & Security

- **API Keys**: Stored locally in `.aicontext.json` or environment variables (never committed to git)
- **Code Privacy**: Use local AI models to keep code on your infrastructure
- **No Data Storage**: AI providers process requests but don't store your code
- **Secure Transmission**: All API calls use HTTPS encryption
- **Security Updates**: Regularly updated dependencies with security patches
- **Input Validation**: Comprehensive validation to prevent injection attacks

## 📄 License

MIT © [AI Code Context Contributors](LICENSE)

## 🔧 Troubleshooting

### Common Issues

**"API key is required" error:**
- Ensure your API key is set in `.aicontext.json` or as an environment variable
- For OpenAI: Set `OPENAI_API_KEY` environment variable
- For Anthropic: Set `ANTHROPIC_API_KEY` environment variable
- For local providers: Ensure `apiUrl` is configured in `.aicontext.json`

**"Rate limit exceeded" error:**
- Wait a few minutes before retrying
- Consider using a different AI provider
- For local providers, ensure your service can handle the request volume

**"Connection refused" for local providers:**
- Verify your local AI service is running (e.g., `ollama serve`)
- Check that the `apiUrl` in your config matches your service URL
- Test the connection: `curl http://localhost:11434/api/chat`

**"File not found" error:**
- Ensure you're running the command from the project root
- Check that the file path is correct relative to the project root
- Verify the file exists and is readable

**Timeout errors:**
- Large code changes may timeout (default: 60s for cloud, 120s for local)
- Try analyzing smaller commit ranges
- For local providers, consider using a faster model

**Git hook not working:**
- Ensure the hook file has execute permissions: `chmod +x .git/hooks/post-commit`
- Verify the hook was installed correctly: `cat .git/hooks/post-commit`
- Check git hook execution: `git config core.hooksPath`

### Debug Mode

Enable detailed error information:
```bash
DEBUG=1 ai-context analyze --staged
```

This will show full error stacks and additional diagnostic information.

## 🙋‍♂️ Support

- 📚 [Documentation](https://github.com/mucahitgurbuz/ai-code-context/wiki)
- 🐛 [Issue Tracker](https://github.com/mucahitgurbuz/ai-code-context/issues)
- 💬 [Discussions](https://github.com/mucahitgurbuz/ai-code-context/discussions)
- 📧 [Email Support](mailto:mucahitgurbuz@gmail.com)

---

**Made with ❤️ by developers, for developers who want to spend less time writing docs and more time writing code.**
