const monthMap = new Map([
  ["01", "Jan"],
  ["02", "Feb"],
  ["03", "March"],
  ["04", "April"],
  ["05", "May"],
  ["06", "Jun"],
  ["07", "July"],
  ["08", "Aug"],
  ["09", "Sept"],
  ["10", "Oct"],
  ["11", "Nov"],
  ["12", "Dec"],
]);

export function formatDate(inputDate) {
  const splittedDate = inputDate.split("-");
  const year = splittedDate[0].slice(2) + "'";
  const month = monthMap.get(splittedDate[1]);
  const day = splittedDate[2][0] === "0" ? splittedDate[2][1] : splittedDate[2];
  return day + " " + month + " " + year;
}
