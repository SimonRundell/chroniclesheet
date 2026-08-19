/**
 * Standard 5e ability modifier: floor((score - 10) / 2).
 *
 * @param {number} score
 * @returns {number}
 */
export function abilityModifier(score) {
    return Math.floor((Number(score) - 10) / 2);
}

/**
 * Formats a modifier with an explicit leading sign, e.g. 3 -> "+3", -1 -> "-1".
 *
 * @param {number} mod
 * @returns {string}
 */
export function formatModifier(mod) {
    return mod >= 0 ? `+${mod}` : `${mod}`;
}
