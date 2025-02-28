// Set up mocks before imports
jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  setFailed: jest.fn()
}));

jest.mock('../src/platform-utils', () => ({
  detectArchitecture: jest.fn()
}));

jest.mock('../src/installer', () => ({
  installTailwind: jest.fn()
}));

// Import after mocking
import * as core from '@actions/core';
import { run } from '../src/index';
import * as platformUtils from '../src/platform-utils';
import * as installer from '../src/installer';

describe('index', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should run successfully with all default parameters', async () => {
    // Setup mocks
    const mockVersion = 'v4.0.9';
    const mockArch = 'linux-x64';
    const mockBinPath = '/usr/local/bin/tailwindcss';

    (core.getInput as jest.Mock).mockImplementation((name) => {
      if (name === 'version') return mockVersion;
      return '';
    });
    (platformUtils.detectArchitecture as jest.Mock).mockReturnValue(mockArch);
    (installer.installTailwind as jest.Mock).mockResolvedValue(mockBinPath);

    // Execute
    await run();

    // Assertions
    expect(core.getInput).toHaveBeenCalledWith('version');
    expect(core.getInput).toHaveBeenCalledWith('architecture');
    expect(core.getInput).toHaveBeenCalledWith('install-dir');
    expect(core.getInput).toHaveBeenCalledWith('binary-name');
    expect(platformUtils.detectArchitecture).toHaveBeenCalled();
    expect(installer.installTailwind).toHaveBeenCalledWith(
      mockVersion, 
      mockArch, 
      { installDir: '/usr/local/bin', binaryName: 'tailwindcss' }
    );
    expect(console.log).toHaveBeenCalledWith(`Using architecture: ${mockArch}`);
    expect(console.log).toHaveBeenCalledWith('Installing to: /usr/local/bin/tailwindcss');
  });

  it('should run successfully with custom parameters', async () => {
    // Setup mocks
    const mockVersion = 'v4.0.9';
    const mockArch = 'macos-arm64';
    const mockInstallDir = '/opt/bin';
    const mockBinaryName = 'twcss';
    const mockBinPath = '/opt/bin/twcss';

    (core.getInput as jest.Mock).mockImplementation((name) => {
      if (name === 'version') return mockVersion;
      if (name === 'architecture') return mockArch;
      if (name === 'install-dir') return mockInstallDir;
      if (name === 'binary-name') return mockBinaryName;
      return '';
    });
    (installer.installTailwind as jest.Mock).mockResolvedValue(mockBinPath);

    // Execute
    await run();

    // Assertions
    expect(platformUtils.detectArchitecture).not.toHaveBeenCalled();
    expect(installer.installTailwind).toHaveBeenCalledWith(
      mockVersion, 
      mockArch, 
      { installDir: mockInstallDir, binaryName: mockBinaryName }
    );
    expect(console.log).toHaveBeenCalledWith(`Using architecture: ${mockArch}`);
    expect(console.log).toHaveBeenCalledWith(`Installing to: ${mockInstallDir}/${mockBinaryName}`);
  });

  it('should handle errors properly', async () => {
    // Setup mocks
    const mockError = new Error('Installation failed');
    (core.getInput as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    // Execute
    await run();

    // Assertions
    expect(core.setFailed).toHaveBeenCalledWith(mockError.message);
  });

  it('should handle non-Error objects properly', async () => {
    // Setup mocks
    (core.getInput as jest.Mock).mockImplementation(() => {
      throw 'Not an Error object';
    });

    // Execute
    await run();

    // Assertions
    expect(core.setFailed).toHaveBeenCalledWith('An unknown error occurred');
  });
});