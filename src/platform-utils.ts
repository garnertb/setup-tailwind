import { platform, arch } from 'os';

export type Architecture = 'macos-arm64' | 'macos-x64' | 'linux-arm64' | 'linux-x64';

interface PlatformHandler {
  canHandle(platform: string): boolean;
  getArchitecture(arch: string): Architecture;
}

class DarwinHandler implements PlatformHandler {
  canHandle(platform: string): boolean {
    return platform === 'darwin';
  }

  getArchitecture(arch: string): Architecture {
    return arch === 'arm64' ? 'macos-arm64' : 'macos-x64';
  }
}

class LinuxHandler implements PlatformHandler {
  canHandle(platform: string): boolean {
    return platform === 'linux';
  }

  getArchitecture(arch: string): Architecture {
    return arch === 'arm64' ? 'linux-arm64' : 'linux-x64';
  }
}

/**
 * Detects the current system architecture
 * @returns The detected architecture string
 * @throws Error if the platform is unsupported
 */
export function detectArchitecture(): Architecture {
  const handlers: PlatformHandler[] = [
    new DarwinHandler(),
    new LinuxHandler()
  ];

  const currentPlatform = platform();
  const currentArch = arch();
  
  const handler = handlers.find(h => h.canHandle(currentPlatform));
  
  if (!handler) {
    throw new Error(`Unsupported platform: ${currentPlatform}`);
  }
  
  return handler.getArchitecture(currentArch);
}