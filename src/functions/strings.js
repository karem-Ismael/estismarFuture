export function classNameWithCondition(condition, trueClass, falseClass, otherClasses) {
  return `${otherClasses} ${condition ? trueClass : falseClass}`;
}

export function leadingZero(num, size) {
  let s = `${num}`;
  while (s.length < size) s = `0${s}`;
  return s;
}

export function dateFormat(date) {
  const day = leadingZero(date.day, 2);
  const month = leadingZero(date.month, 2);
  return `${day}/${month}/${date.year}`;
}

export function dateStringToObject(dateString, splitter = "-") {
  const dateArr = dateString?.split(splitter);
  if (Array.isArray(dateArr)) {
    const [year, month, day] = dateArr;
    return { day: +day, month: +month, year: +year };
  }
  return null;
}

export function dateCompareString(date, time) {
  return `${date}T${time}Z`;
}
