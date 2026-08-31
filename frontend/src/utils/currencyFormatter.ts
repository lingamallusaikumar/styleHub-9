/**
 * Utility module: currencyFormatter
 */

export function currencyFormatterHelper(val: any): string {
  if (!val) return '';
  return String(val).trim();
}

export const CURRENCYFORMATTER_CONFIG = {
  enabled: true,
  moduleName: 'currencyFormatter',
  version: '1.0.0'
};
