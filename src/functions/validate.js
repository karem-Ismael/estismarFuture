import * as regex from "../constants/regex";

export const isValidEmail = (value) => regex.emailPattern.test(value);

export const isEmptyString = (str) => str.length === 0;
