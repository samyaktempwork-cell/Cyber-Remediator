export type ServiceName = 'HUNTER' | 'EMAILREP' | 'NUMVERIFY' | 'GOOGLE_SEARCH' | 'VIRUSTOTAL';

export const config = {
  kestraApiUrl: process.env.VITE_KESTRA_API_URL || 'http://localhost:8080',
  geminiApiKey: process.env.API_KEY,
  awsAccessKey: process.env.VITE_AWS_ACCESS_KEY || '',
  isProduction: typeof window !== 'undefined' ? window.location.hostname !== 'localhost' : process.env.NODE_ENV === 'production',
};

/**
 * Registry mapping logical service names to environment variables.
 * This allows for flexible naming conventions and easier configuration management.
 */
const SERVICE_REGISTRY: Record<ServiceName, { flag: string, key: string }> = {
  HUNTER: { flag: 'VITE_ENABLE_HUNTER', key: 'VITE_HUNTER_API_KEY' },
  EMAILREP: { flag: 'VITE_ENABLE_EMAILREP', key: 'VITE_EMAILREP_API_KEY' },
  NUMVERIFY: { flag: 'VITE_ENABLE_NUMVERIFY', key: 'VITE_NUMVERIFY_API_KEY' },
  GOOGLE_SEARCH: { flag: 'VITE_ENABLE_GOOGLE_SEARCH', key: 'VITE_GOOGLE_API_KEY' },
  VIRUSTOTAL: { flag: 'VITE_ENABLE_VIRUSTOTAL', key: 'VITE_VIRUSTOTAL_API_KEY' }
};

/**
 * Dynamic Service Configuration Helper
 * Retrieves both the enablement status and the associated API key for a service.
 */
export const getServiceConfig = (name: ServiceName) => {
  const meta = SERVICE_REGISTRY[name];
  if (!meta) return { enabled: false, apiKey: null };
  
  return {
    enabled: process.env[meta.flag] === 'true',
    apiKey: process.env[meta.key] || null,
  };
};

export const API_FLAGS = {
  /**
   * Check if a specific security service is enabled in the current environment.
   */
  isEnabled: (name: ServiceName) => getServiceConfig(name).enabled,
  
  /**
   * Retrieves the API key for a service if enabled and present.
   */
  getKey: (name: ServiceName) => getServiceConfig(name).apiKey,
};

/**
 * .env.local Template Example:
 * 
 * # Toggles
 * VITE_ENABLE_HUNTER=false
 * VITE_ENABLE_EMAILREP=false
 * VITE_ENABLE_NUMVERIFY=false
 * VITE_ENABLE_GOOGLE_SEARCH=false
 * 
 * # Keys
 * VITE_HUNTER_API_KEY=your_key
 * VITE_EMAILREP_API_KEY=your_key
 * VITE_NUMVERIFY_API_KEY=your_key
 * VITE_GOOGLE_API_KEY=your_key
 */
