export function getDateAndTime(
  date: Date | undefined,
  toUTC: boolean | undefined
): string {
  const timeStamp: Date = !date ? new Date() : date;

  if (toUTC === true) {
    return timeStamp.toISOString();
  }

  const year = timeStamp.getFullYear();
  const month =
    timeStamp.getMonth() + 1 < 10
      ? "0" + (timeStamp.getMonth() + 1)
      : timeStamp.getMonth() + 1;
  const day =
    timeStamp.getDate() < 10 ? "0" + timeStamp.getDate() : timeStamp.getDate();
  const hours =
    timeStamp.getHours() < 10
      ? "0" + timeStamp.getHours()
      : timeStamp.getHours();
  const minutes =
    timeStamp.getMinutes() < 10
      ? "0" + timeStamp.getMinutes()
      : timeStamp.getMinutes();
  const seconds =
    timeStamp.getSeconds() < 10
      ? "0" + timeStamp.getSeconds()
      : timeStamp.getSeconds();

  const data =
    year +
    "-" +
    month +
    "-" +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;

  return data;
}

export function formatDate(d: string): string {
  const [date, time] = d.split(" ");
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year} ${time}`;
}

export function UTCtoLocale(date: string): string {
  const dt = new Date(`${date} UTC`.replace(" ", "T").replace(" UTC", "Z"));

  try {
    const DateGMT = dt.toISOString();

    //const DateGMT = new Date(date + " UTC".replace(" ", "T").replace(" UTC", "Z")).toString();

    const startDateUTC = new Date(DateGMT);

    const formatDate =
      startDateUTC.getFullYear() +
      "-" +
      (startDateUTC.getMonth() + 1 < 10
        ? "0" + (startDateUTC.getMonth() + 1)
        : startDateUTC.getMonth() + 1) +
      "-" +
      (startDateUTC.getDate() < 10
        ? "0" + startDateUTC.getDate()
        : startDateUTC.getDate()) +
      " " +
      (startDateUTC.getHours() < 10
        ? "0" + startDateUTC.getHours()
        : startDateUTC.getHours()) +
      ":" +
      (startDateUTC.getMinutes() < 10
        ? "0" + startDateUTC.getMinutes()
        : startDateUTC.getMinutes()) +
      ":" +
      (startDateUTC.getSeconds() < 10
        ? "0" + startDateUTC.getSeconds()
        : startDateUTC.getSeconds());

    return formatDate;
    //then u can use new Date(formatDate).getTime();
  } catch (e) {
    if (e instanceof Error) {
      // Type Narrowing: now TypeScript knows 'e' is an Error object
      console.error("Error converting local time ti UTC", e.message);
    } else {
      // Handle cases where non-Error objects are thrown (e.g., throw "A string")
      console.error("An unknown type of error occurred:", e);
    }
    return date.replace(/\//g, "-");
  }
}
