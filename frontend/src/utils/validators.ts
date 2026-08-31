/**
 * Utility module: validators
 */

export function validatorsHelper(val: any): string {
  if (!val) return '';
  return String(val).trim();
}

export const VALIDATORS_CONFIG = {
  enabled: true,
  moduleName: 'validators',
  version: '1.0.0'
};
