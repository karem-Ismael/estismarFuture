export function isNumber(num) {
  return /^[0-9]+$/.test(num.toString()) || /^[٠١٢٣٤٥٦٧٨٩]+$/.test(num.toString());
}

/**
 * @name easternToEnglishNumbers
 * @description gives the equivalent
 * @export
 * @param {string} strNumber
 * @return {string}
 * @example
 * easternToEnglishNumbers("٥٦٧٨")
 * // 5678
 */
export function easternToEnglishNumbers(strNumber) {
  return strNumber
    .replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => d.charCodeAt(0) - 1632)
    .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, (d) => d.charCodeAt(0) - 1776);
}
