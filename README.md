# Setup Tailwind CSS Action

This action installs the Tailwind CSS CLI binary for use in GitHub Actions workflows.

## Usage

Basic usage (auto-detects architecture):
```yaml
steps:
- uses: ./.github/actions/setup-tailwind
  with:
    version: 'v3.3.5'
```

With explicit architecture:
```yaml
steps:
- uses: ./.github/actions/setup-tailwind
  with:
    version: 'v3.3.5'
    architecture: 'linux-x64'
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| version | Tailwind CSS version to install | Yes | v4.0.9 |
| architecture | Target architecture (linux-x64, linux-arm64, macos-arm64) | No | Auto-detected |

## Development

1. Install dependencies:
```bash
npm install
```

2. Build the action:
```bash
npm run build
```

This will create a `dist` folder with the compiled action code. The `dist` folder should be committed to the repository.
