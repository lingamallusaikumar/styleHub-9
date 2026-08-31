/**
 * Utility module: dateFormatter
 */

export function dateFormatterHelper(val: any): string {
  if (!val) return '';
  return String(val).trim();
}

export const DATEFORMATTER_CONFIG = {
  enabled: true,
  moduleName: 'dateFormatter',
  version: '1.0.0'
};
