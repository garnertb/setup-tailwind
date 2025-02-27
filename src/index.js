const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const fs = require('fs');
const os = require('os');

function detectArchitecture() {
    const platform = os.platform();
    const arch = os.arch();
    
    if (platform === 'darwin') {
        return arch === 'arm64' ? 'macos-arm64' : 'macos-x64';
    }
    
    if (platform === 'linux') {
        return arch === 'arm64' ? 'linux-arm64' : 'linux-x64';
    }
    
    throw new Error(`Unsupported platform: ${platform}`);
}

async function run() {
    try {
        const version = core.getInput('version');
        const arch = core.getInput('architecture') || detectArchitecture();
        
        console.log(`Using architecture: ${arch}`);
        
        const downloadUrl = `https://github.com/tailwindlabs/tailwindcss/releases/download/${version}/tailwindcss-${arch}`;
        
        console.log(`Downloading Tailwind CSS from ${downloadUrl}`);
        
        const downloadPath = await tc.downloadTool(downloadUrl);
        const binPath = '/usr/local/bin/tailwindcss';
        
        // Make executable and move to PATH
        fs.chmodSync(downloadPath, '755');
        fs.renameSync(downloadPath, binPath);
        
        console.log('Tailwind CSS installed successfully');
        core.addPath('/usr/local/bin');
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
