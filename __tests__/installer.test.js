"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const installer_1 = require("../src/installer");
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
const tc = __importStar(require("@actions/tool-cache"));
const fs = __importStar(require("fs"));
const core = __importStar(require("@actions/core"));
const path = __importStar(require("path"));
describe('installer', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        // Spy on console.log to verify output
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });
    describe('getDownloadUrl', () => {
        it('should generate correct URL for a given version and architecture', () => {
            const version = 'v4.0.9';
            const arch = 'macos-arm64';
            const url = (0, installer_1.getDownloadUrl)(version, arch);
            expect(url).toBe('https://github.com/tailwindlabs/tailwindcss/releases/download/v4.0.9/tailwindcss-macos-arm64');
        });
    });
    describe('installTailwind', () => {
        it('should download and install Tailwind CSS with default options', async () => {
            // Setup mocks
            const mockVersion = 'v4.0.9';
            const mockArch = 'linux-x64';
            const mockDownloadPath = '/temp/path/tailwind';
            const binPath = '/usr/local/bin/tailwindcss';
            fs.existsSync.mockReturnValue(true);
            tc.downloadTool.mockResolvedValue(mockDownloadPath);
            path.join.mockReturnValue(binPath);
            // Execute
            const result = await (0, installer_1.installTailwind)(mockVersion, mockArch);
            // Assertions
            expect(tc.downloadTool).toHaveBeenCalledWith('https://github.com/tailwindlabs/tailwindcss/releases/download/v4.0.9/tailwindcss-linux-x64');
            expect(fs.chmodSync).toHaveBeenCalledWith(mockDownloadPath, '755');
            expect(fs.renameSync).toHaveBeenCalledWith(mockDownloadPath, binPath);
            expect(core.addPath).toHaveBeenCalledWith('/usr/local/bin');
            expect(result).toBe(binPath);
        });
        it('should download and install Tailwind CSS with custom options', async () => {
            // Setup mocks
            const mockVersion = 'v4.0.9';
            const mockArch = 'macos-arm64';
            const mockDownloadPath = '/temp/path/tailwind';
            const customInstallDir = '/opt/bin';
            const customBinaryName = 'twcss';
            const expectedBinPath = '/opt/bin/twcss';
            fs.existsSync.mockReturnValue(false);
            tc.downloadTool.mockResolvedValue(mockDownloadPath);
            path.join.mockReturnValue(expectedBinPath);
            // Execute
            const result = await (0, installer_1.installTailwind)(mockVersion, mockArch, {
                installDir: customInstallDir,
                binaryName: customBinaryName
            });
            // Assertions
            expect(tc.downloadTool).toHaveBeenCalledWith('https://github.com/tailwindlabs/tailwindcss/releases/download/v4.0.9/tailwindcss-macos-arm64');
            expect(fs.existsSync).toHaveBeenCalledWith(customInstallDir);
            expect(fs.mkdirSync).toHaveBeenCalledWith(customInstallDir, { recursive: true });
            expect(fs.chmodSync).toHaveBeenCalledWith(mockDownloadPath, '755');
            expect(fs.renameSync).toHaveBeenCalledWith(mockDownloadPath, expectedBinPath);
            expect(core.addPath).toHaveBeenCalledWith(customInstallDir);
            expect(result).toBe(expectedBinPath);
        });
        it('should throw an error if download fails', async () => {
            const mockVersion = 'v4.0.9';
            const mockArch = 'macos-x64';
            const mockError = new Error('Download failed');
            tc.downloadTool.mockRejectedValue(mockError);
            await expect((0, installer_1.installTailwind)(mockVersion, mockArch)).rejects.toThrow('Download failed');
        });
    });
});
