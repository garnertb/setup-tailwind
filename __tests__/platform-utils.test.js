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
const os = __importStar(require("os"));
const platform_utils_1 = require("../src/platform-utils");
// Mock os module
jest.mock('os');
const mockedOs = os;
describe('platform-utils', () => {
    describe('detectArchitecture', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });
        it('should return macos-arm64 for darwin platform with arm64 architecture', () => {
            mockedOs.platform.mockReturnValue('darwin');
            mockedOs.arch.mockReturnValue('arm64');
            const result = (0, platform_utils_1.detectArchitecture)();
            expect(result).toBe('macos-arm64');
        });
        it('should return macos-x64 for darwin platform with non-arm64 architecture', () => {
            mockedOs.platform.mockReturnValue('darwin');
            mockedOs.arch.mockReturnValue('x64');
            const result = (0, platform_utils_1.detectArchitecture)();
            expect(result).toBe('macos-x64');
        });
        it('should return linux-arm64 for linux platform with arm64 architecture', () => {
            mockedOs.platform.mockReturnValue('linux');
            mockedOs.arch.mockReturnValue('arm64');
            const result = (0, platform_utils_1.detectArchitecture)();
            expect(result).toBe('linux-arm64');
        });
        it('should return linux-x64 for linux platform with non-arm64 architecture', () => {
            mockedOs.platform.mockReturnValue('linux');
            mockedOs.arch.mockReturnValue('x64');
            const result = (0, platform_utils_1.detectArchitecture)();
            expect(result).toBe('linux-x64');
        });
        it('should throw error for unsupported platform', () => {
            // Using any type assertion to allow testing with an unsupported platform value
            mockedOs.platform.mockReturnValue('windows');
            expect(() => (0, platform_utils_1.detectArchitecture)()).toThrow('Unsupported platform: windows');
        });
    });
});
