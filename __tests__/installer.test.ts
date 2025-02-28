import { getDownloadUrl, installTailwind } from '../src/installer';
import { Architecture } from '../src/platform-utils';

// Mock dependencies
jest.mock('@actions/tool-cache', () => ({
  downloadTool: jest.fn()
}));

jest.mock('fs', () => ({
  chmodSync: jest.fn(),
  renameSync: jest.fn(),
  existsSync: jest.fn(),
  mkdirSync: jest.fn()
}));

jest.mock('@actions/core', () => ({
  addPath: jest.fn()
}));

jest.mock('path', () => ({
  dirname: jest.fn((path) => {
    // Simple mock for dirname that behaves correctly
    return path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : path;
  }),
  join: jest.fn((dir, file) => `${dir}/${file}`)
}));

// Import mocks after mocking
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import * as core from '@actions/core';
import * as path from 'path';

describe('installer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // Spy on console.log to verify output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('getDownloadUrl', () => {
    it('should generate correct URL for a given version and architecture', () => {
      const version = 'v4.0.9';
      const arch: Architecture = 'macos-arm64';
      
      const url = getDownloadUrl(version, arch);
      
      expect(url).toBe('https://github.com/tailwindlabs/tailwindcss/releases/download/v4.0.9/tailwindcss-macos-arm64');
    });
  });

  describe('installTailwind', () => {
    it('should download and install Tailwind CSS with default options', async () => {
      // Setup mocks
      const mockVersion = 'v4.0.9';
      const mockArch: Architecture = 'linux-x64';
      const mockDownloadPath = '/temp/path/tailwind';
      const binPath = '/usr/local/bin/tailwindcss';
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (tc.downloadTool as jest.Mock).mockResolvedValue(mockDownloadPath);
      (path.join as jest.Mock).mockReturnValue(binPath);
      
      // Execute
      const result = await installTailwind(mockVersion, mockArch);
      
      // Assertions
      expect(tc.downloadTool).toHaveBeenCalledWith(
        'https://github.com/tailwindlabs/tailwindcss/releases/download/v4.0.9/tailwindcss-linux-x64'
      );
      expect(fs.chmodSync).toHaveBeenCalledWith(mockDownloadPath, '755');
      expect(fs.renameSync).toHaveBeenCalledWith(mockDownloadPath, binPath);
      expect(core.addPath).toHaveBeenCalledWith('/usr/local/bin');
      expect(result).toBe(binPath);
    });

    it('should download and install Tailwind CSS with custom options', async () => {
      // Setup mocks
      const mockVersion = 'v4.0.9';
      const mockArch: Architecture = 'macos-arm64';
      const mockDownloadPath = '/temp/path/tailwind';
      const customInstallDir = '/opt/bin';
      const customBinaryName = 'twcss';
      const expectedBinPath = '/opt/bin/twcss';
      
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (tc.downloadTool as jest.Mock).mockResolvedValue(mockDownloadPath);
      (path.join as jest.Mock).mockReturnValue(expectedBinPath);
      
      // Execute
      const result = await installTailwind(mockVersion, mockArch, {
        installDir: customInstallDir,
        binaryName: customBinaryName
      });
      
      // Assertions
      expect(tc.downloadTool).toHaveBeenCalledWith(
        'https://github.com/tailwindlabs/tailwindcss/releases/download/v4.0.9/tailwindcss-macos-arm64'
      );
      expect(fs.existsSync).toHaveBeenCalledWith(customInstallDir);
      expect(fs.mkdirSync).toHaveBeenCalledWith(customInstallDir, { recursive: true });
      expect(fs.chmodSync).toHaveBeenCalledWith(mockDownloadPath, '755');
      expect(fs.renameSync).toHaveBeenCalledWith(mockDownloadPath, expectedBinPath);
      expect(core.addPath).toHaveBeenCalledWith(customInstallDir);
      expect(result).toBe(expectedBinPath);
    });

    it('should throw an error if download fails', async () => {
      const mockVersion = 'v4.0.9';
      const mockArch: Architecture = 'macos-x64';
      const mockError = new Error('Download failed');
      
      (tc.downloadTool as jest.Mock).mockRejectedValue(mockError);
      
      await expect(installTailwind(mockVersion, mockArch)).rejects.toThrow('Download failed');
    });
  });
});