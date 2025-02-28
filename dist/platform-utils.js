"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectArchitecture = detectArchitecture;
const os_1 = require("os");
class DarwinHandler {
    canHandle(platform) {
        return platform === 'darwin';
    }
    getArchitecture(arch) {
        return arch === 'arm64' ? 'macos-arm64' : 'macos-x64';
    }
}
class LinuxHandler {
    canHandle(platform) {
        return platform === 'linux';
    }
    getArchitecture(arch) {
        return arch === 'arm64' ? 'linux-arm64' : 'linux-x64';
    }
}
/**
 * Detects the current system architecture
 * @returns The detected architecture string
 * @throws Error if the platform is unsupported
 */
function detectArchitecture() {
    const handlers = [
        new DarwinHandler(),
        new LinuxHandler()
    ];
    const currentPlatform = (0, os_1.platform)();
    const currentArch = (0, os_1.arch)();
    const handler = handlers.find(h => h.canHandle(currentPlatform));
    if (!handler) {
        throw new Error(`Unsupported platform: ${currentPlatform}`);
    }
    return handler.getArchitecture(currentArch);
}
