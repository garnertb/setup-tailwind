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
const core = __importStar(require("@actions/core"));
const index_1 = require("../src/index");
const platformUtils = __importStar(require("../src/platform-utils"));
const installer = __importStar(require("../src/installer"));
describe('index', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });
    it('should run successfully with all default parameters', async () => {
        // Setup mocks
        const mockVersion = 'v4.0.9';
        const mockArch = 'linux-x64';
        const mockBinPath = '/usr/local/bin/tailwindcss';
        core.getInput.mockImplementation((name) => {
            if (name === 'version')
                return mockVersion;
            return '';
        });
        platformUtils.detectArchitecture.mockReturnValue(mockArch);
        installer.installTailwind.mockResolvedValue(mockBinPath);
        // Execute
        await (0, index_1.run)();
        // Assertions
        expect(core.getInput).toHaveBeenCalledWith('version');
        expect(core.getInput).toHaveBeenCalledWith('architecture');
        expect(core.getInput).toHaveBeenCalledWith('install-dir');
        expect(core.getInput).toHaveBeenCalledWith('binary-name');
        expect(platformUtils.detectArchitecture).toHaveBeenCalled();
        expect(installer.installTailwind).toHaveBeenCalledWith(mockVersion, mockArch, { installDir: '/usr/local/bin', binaryName: 'tailwindcss' });
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
        core.getInput.mockImplementation((name) => {
            if (name === 'version')
                return mockVersion;
            if (name === 'architecture')
                return mockArch;
            if (name === 'install-dir')
                return mockInstallDir;
            if (name === 'binary-name')
                return mockBinaryName;
            return '';
        });
        installer.installTailwind.mockResolvedValue(mockBinPath);
        // Execute
        await (0, index_1.run)();
        // Assertions
        expect(platformUtils.detectArchitecture).not.toHaveBeenCalled();
        expect(installer.installTailwind).toHaveBeenCalledWith(mockVersion, mockArch, { installDir: mockInstallDir, binaryName: mockBinaryName });
        expect(console.log).toHaveBeenCalledWith(`Using architecture: ${mockArch}`);
        expect(console.log).toHaveBeenCalledWith(`Installing to: ${mockInstallDir}/${mockBinaryName}`);
    });
    it('should handle errors properly', async () => {
        // Setup mocks
        const mockError = new Error('Installation failed');
        core.getInput.mockImplementation(() => {
            throw mockError;
        });
        // Execute
        await (0, index_1.run)();
        // Assertions
        expect(core.setFailed).toHaveBeenCalledWith(mockError.message);
    });
    it('should handle non-Error objects properly', async () => {
        // Setup mocks
        core.getInput.mockImplementation(() => {
            throw 'Not an Error object';
        });
        // Execute
        await (0, index_1.run)();
        // Assertions
        expect(core.setFailed).toHaveBeenCalledWith('An unknown error occurred');
    });
});
