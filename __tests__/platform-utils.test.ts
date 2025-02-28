import * as os from 'os';
import { detectArchitecture } from '../src/platform-utils';

// Mock os module
jest.mock('os');
const mockedOs = os as jest.Mocked<typeof os>;

describe('platform-utils', () => {
  describe('detectArchitecture', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    
    it('should return macos-arm64 for darwin platform with arm64 architecture', () => {
      mockedOs.platform.mockReturnValue('darwin');
      mockedOs.arch.mockReturnValue('arm64');
      
      const result = detectArchitecture();
      
      expect(result).toBe('macos-arm64');
    });
    
    it('should return macos-x64 for darwin platform with non-arm64 architecture', () => {
      mockedOs.platform.mockReturnValue('darwin');
      mockedOs.arch.mockReturnValue('x64');
      
      const result = detectArchitecture();
      
      expect(result).toBe('macos-x64');
    });
    
    it('should return linux-arm64 for linux platform with arm64 architecture', () => {
      mockedOs.platform.mockReturnValue('linux');
      mockedOs.arch.mockReturnValue('arm64');
      
      const result = detectArchitecture();
      
      expect(result).toBe('linux-arm64');
    });
    
    it('should return linux-x64 for linux platform with non-arm64 architecture', () => {
      mockedOs.platform.mockReturnValue('linux');
      mockedOs.arch.mockReturnValue('x64');
      
      const result = detectArchitecture();
      
      expect(result).toBe('linux-x64');
    });
    
    it('should throw error for unsupported platform', () => {
      // Using any type assertion to allow testing with an unsupported platform value
      (mockedOs.platform as jest.Mock<any>).mockReturnValue('windows');
      
      expect(() => detectArchitecture()).toThrow('Unsupported platform: windows');
    });
  });
});