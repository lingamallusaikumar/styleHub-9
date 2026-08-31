/**
 * Utility module: domUtils
 */

export function domUtilsHelper(val: any): string {
  if (!val) return '';
  return String(val).trim();
}

export const DOMUTILS_CONFIG = {
  enabled: true,
  moduleName: 'domUtils',
  version: '1.0.0'
};
