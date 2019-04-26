
export const YEAR_OF_BIRTH_OPTIONS = (() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  let startYear = currentYear - 120;
  while (startYear < currentYear) {
    startYear += 1;

    years.push({ value: startYear, label: startYear });
  }
  return years.reverse();
})();

export const EDUCATION_LEVELS = [
  'p',
  'm',
  'b',
  'a',
  'hs',
  'jhs',
  'el',
  'none',
  'o',
];
