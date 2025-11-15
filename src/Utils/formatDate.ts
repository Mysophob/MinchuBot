function dateToString(input: Date): string {
  const yyyy = input.getFullYear();
  let mm = input.getMonth() + 1; // Months start at 0!
  let dd = input.getDate();

  if (dd < 10) dd = 0 + dd;
  if (mm < 10) mm = 0 + mm;

  const formattedToday = `${dd}.${mm}.${yyyy}`;
  return formattedToday;
}

export default dateToString;
