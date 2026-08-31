/**
 * Utility module: formatters
 */

export function formattersHelper(val: any): string {
  if (!val) return '';
  return String(val).trim();
}

export const FORMATTERS_CONFIG = {
  enabled: true,
  moduleName: 'formatters',
  version: '1.0.0'
};
