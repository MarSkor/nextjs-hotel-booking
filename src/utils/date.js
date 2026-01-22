import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);
dayjs.extend(localizedFormat);

dayjs().format("L LT");

export const parseDate = (iso) => {
  const date = dayjs(iso);
  if (!date.isValid()) return { error: `Invalid dates: ${iso}` };
  return date;
};

export const isDate = (
  input,
  { asNative = false, throwError = false } = {},
) => {
  if (!input) return null;
  const d = dayjs(input);
  if (!d.isValid()) {
    return throwError ? { error: `Invalid Date: ${input}` } : null;
  }

  return asNative ? d.toDate() : d;
};

export const calculateNights = (IsoCheckIn, IsoCheckOut) => {
  const checkIn = parseDate(IsoCheckIn);
  const checkOut = parseDate(IsoCheckOut);

  const nights = checkOut.diff(checkIn, "day");
  if (nights <= 0) return { error: "Invalid dates" };
  return nights;
};
