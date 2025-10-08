/* Shared severity palette mirrored from the CSS custom properties in
 * app/src/global styles/global-styles.css so renderer scripts can
 * consume consistent colour values without duplicating hex codes.
 */
(function (root) {
  const SEVERITY_COLORS = Object.freeze({
    // LOW: '#00FF00',
    LOW: '#000000',
    MEDIUM: '#FAAB24',
    HIGH: '#ff0000',
    // HIGH: '#E35623',
    CRITICAL: '#8B0000'
    // CRITICAL: '#D32A26'
  });

  const SEVERITY_CONTRAST_COLORS = Object.freeze({
    LOW: '#ffffff',
    MEDIUM: '#000000',
    HIGH: '#ffffff',
    CRITICAL: '#ffffff'
  });

  const exported = Object.freeze({
    SEVERITY_COLORS,
    SEVERITY_CONTRAST_COLORS,
    LOW: SEVERITY_COLORS.LOW,
    MEDIUM: SEVERITY_COLORS.MEDIUM,
    HIGH: SEVERITY_COLORS.HIGH,
    CRITICAL: SEVERITY_COLORS.CRITICAL,
    LOW_CONTRAST: SEVERITY_CONTRAST_COLORS.LOW,
    MEDIUM_CONTRAST: SEVERITY_CONTRAST_COLORS.MEDIUM,
    HIGH_CONTRAST: SEVERITY_CONTRAST_COLORS.HIGH,
    CRITICAL_CONTRAST: SEVERITY_CONTRAST_COLORS.CRITICAL
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
  }

  if (root) {
    const target = root.COLOR_CONSTANTS || {};
    Object.assign(target, exported);
    root.COLOR_CONSTANTS = Object.freeze(target);
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : undefined));
