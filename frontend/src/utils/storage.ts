/**
 * Utility module: storage
 */

export function storageHelper(val: any): string {
  if (!val) return '';
  return String(val).trim();
}

export const STORAGE_CONFIG = {
  enabled: true,
  moduleName: 'storage',
  version: '1.0.0'
};
