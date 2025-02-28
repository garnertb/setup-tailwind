"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDownloadUrl = getDownloadUrl;
exports.installTailwind = installTailwind;
const tool_cache_1 = require("@actions/tool-cache");
const fs_1 = require("fs");
const core_1 = require("@actions/core");
const path_1 = require("path");
/**
 * Creates download URL for Tailwind CSS CLI
 * @param version The version of Tailwind to download
 * @param arch The target architecture
 * @returns The download URL
 */
function getDownloadUrl(version, arch) {
    return `https://github.com/tailwindlabs/tailwindcss/releases/download/${version}/tailwindcss-${arch}`;
}
/**
 * Downloads and installs Tailwind CSS CLI
 * @param version The version to install
 * @param arch The target architecture
 * @param options Installation options
 * @returns The path to the installed binary
 */
async function installTailwind(version, arch, options = {}) {
    const { installDir = '/usr/local/bin', binaryName = 'tailwindcss' } = options;
    // Ensure installation directory exists
    if (!(0, fs_1.existsSync)(installDir)) {
        // Create the directory with recursive option
        (0, fs_1.mkdirSync)(installDir, { recursive: true });
    }
    const downloadUrl = getDownloadUrl(version, arch);
    console.log(`Downloading Tailwind CSS from ${downloadUrl}`);
    const downloadPath = await (0, tool_cache_1.downloadTool)(downloadUrl);
    const binPath = (0, path_1.join)(installDir, binaryName);
    // Make executable and move to PATH
    (0, fs_1.chmodSync)(downloadPath, '755');
    (0, fs_1.renameSync)(downloadPath, binPath);
    console.log(`Tailwind CSS installed successfully to ${binPath}`);
    (0, core_1.addPath)(installDir);
    return binPath;
}
