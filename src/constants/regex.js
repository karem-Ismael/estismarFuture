/* eslint-disable no-useless-escape */
export const emailPattern = /^\w+(?:\.?|\-??\w+)*@\w+(?:\.?|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const specialCharacters = /[!@#$%^&*£(),.?":{}|<>]/;
export const pricePattern = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
export const numbersPattern = /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/;
export const containsSpecialCharacters = /[!@#$%^&*€¹²³¾½¾()_+\-=\[\]{};':"\\|,.<>\/?]/;
export const ddMMYYYPattern = /[0-9]{1,2}([./-])[0-9]{1,2}([./-])[0-9]{4}/;
export const strongPasswordRegex = new RegExp(
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*~` €¹²³¾½¾()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{8,15}$)/,
);
export const iqamaPattren = /^2\d/;
export const borderNumber=/^[0-9]*$/
export const numberLetters=/^[a-zA-Z0-9_.-]*$/;