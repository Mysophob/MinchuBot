function dateToString(input: Date, options?: { hideYear?: boolean }): string {
  const yyyy = input.getFullYear();
  let mm: number = input.getMonth() + 1;
  let dd: number = input.getDate();

  if (dd < 10) dd = 0 + dd;
  if (mm < 10) mm = 0 + mm;

  if (options?.hideYear || yyyy === 1900) {
    return `${dd}.${mm}`;
  }

  return `${dd}.${mm}.${yyyy}`;
}

export default dateToString;