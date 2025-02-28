import { getInput, setFailed } from '@actions/core';
import { detectArchitecture, Architecture } from './platform-utils';
import { installTailwind, InstallOptions } from './installer';

async function run(): Promise<void> {
    try {
        const version = getInput('version');
        const arch = getInput('architecture') || detectArchitecture();
        
        // Parse optional installation parameters
        const installDir = getInput('install-dir') || '/usr/local/bin';
        const binaryName = getInput('binary-name') || 'tailwindcss';
        
        console.log(`Using architecture: ${arch}`);
        console.log(`Installing to: ${installDir}/${binaryName}`);
        
        // Configure installation options
        const options: InstallOptions = {
            installDir,
            binaryName
        };
        
        // Install Tailwind CSS CLI
        await installTailwind(version, arch as Architecture, options);
        
    } catch (error) {
        if (error instanceof Error) {
            setFailed(error.message);
        } else {
            setFailed('An unknown error occurred');
        }
    }
}

// Export for testing
export { run };

// Execute when called directly
if (require.main === module) {
    run();
}