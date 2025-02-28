import { downloadTool } from '@actions/tool-cache';
import { chmodSync, renameSync, existsSync, mkdirSync } from 'fs';
import { addPath } from '@actions/core';
import { dirname, join } from 'path';
import { Architecture } from './platform-utils';

/**
 * Creates download URL for Tailwind CSS CLI
 * @param version The version of Tailwind to download
 * @param arch The target architecture
 * @returns The download URL
 */
export function getDownloadUrl(version: string, arch: Architecture): string {
    return `https://github.com/tailwindlabs/tailwindcss/releases/download/${version}/tailwindcss-${arch}`;
}

export interface InstallOptions {
    /** The installation directory (defaults to /usr/local/bin) */
    installDir?: string;
    /** The binary name (defaults to tailwindcss) */
    binaryName?: string;
}

/**
 * Downloads and installs Tailwind CSS CLI
 * @param version The version to install
 * @param arch The target architecture
 * @param options Installation options
 * @returns The path to the installed binary
 */
export async function installTailwind(
    version: string, 
    arch: Architecture, 
    options: InstallOptions = {}
): Promise<string> {
    const { 
        installDir = '/usr/local/bin',
        binaryName = 'tailwindcss'
    } = options;
    
    // Ensure installation directory exists
    if (!existsSync(installDir)) {
        // Create the directory with recursive option
        mkdirSync(installDir, { recursive: true });
    }
    
    const downloadUrl = getDownloadUrl(version, arch);
    console.log(`Downloading Tailwind CSS from ${downloadUrl}`);
    
    const downloadPath = await downloadTool(downloadUrl);
    const binPath = join(installDir, binaryName);
    
    // Make executable and move to PATH
    chmodSync(downloadPath, '755');
    renameSync(downloadPath, binPath);
    
    console.log(`Tailwind CSS installed successfully to ${binPath}`);
    addPath(installDir);
    
    return binPath;
}