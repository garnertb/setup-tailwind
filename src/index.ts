import { getInput, setFailed, addPath } from '@actions/core';
import { downloadTool } from '@actions/tool-cache';
import { chmodSync, renameSync } from 'fs';
import { platform, arch } from 'os';

type Architecture = 'macos-arm64' | 'macos-x64' | 'linux-arm64' | 'linux-x64';

function detectArchitecture(): Architecture {
    const currentPlatform = platform();
    const currentArch = arch();
    
    if (currentPlatform === 'darwin') {
        return currentArch === 'arm64' ? 'macos-arm64' : 'macos-x64';
    }
    
    if (currentPlatform === 'linux') {
        return currentArch === 'arm64' ? 'linux-arm64' : 'linux-x64';
    }
    
    throw new Error(`Unsupported platform: ${currentPlatform}`);
}

async function run(): Promise<void> {
    try {
        const version = getInput('version');
        const arch = getInput('architecture') || detectArchitecture();
        
        console.log(`Using architecture: ${arch}`);
        
        const downloadUrl = `https://github.com/tailwindlabs/tailwindcss/releases/download/${version}/tailwindcss-${arch}`;
        
        console.log(`Downloading Tailwind CSS from ${downloadUrl}`);
        
        const downloadPath = await downloadTool(downloadUrl);
        const binPath = '/usr/local/bin/tailwindcss';
        
        // Make executable and move to PATH
        chmodSync(downloadPath, '755');
        renameSync(downloadPath, binPath);
        
        console.log('Tailwind CSS installed successfully');
        addPath('/usr/local/bin');
    } catch (error) {
        if (error instanceof Error) {
            setFailed(error.message);
        } else {
            setFailed('An unknown error occurred');
        }
    }
}

run();