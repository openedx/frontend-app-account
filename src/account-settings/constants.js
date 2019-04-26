
// eslint-disable-next-line import/prefer-default-export
export const yearOfBirthOptions = (() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  let startYear = currentYear - 120;
  while (startYear < currentYear) {
    startYear += 1;

    years.push({ value: startYear, label: startYear });
  }
  return years.reverse();
})();
