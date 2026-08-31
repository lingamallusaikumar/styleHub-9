/**
 * Utility module: constants
 */

export function constantsHelper(val: any): string {
  if (!val) return '';
  return String(val).trim();
}

export const CONSTANTS_CONFIG = {
  enabled: true,
  moduleName: 'constants',
  version: '1.0.0'
};
