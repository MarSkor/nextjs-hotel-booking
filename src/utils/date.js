import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

dayjs().format("L LT");

export const parseDate = (iso) => {
  const date = dayjs(iso);
  if (!date.isValid()) return { error: `Invalid dates: ${iso}` };
  return date;
};

export const calculateNights = (IsoCheckIn, IsoCheckOut) => {
  const checkIn = parseDate(IsoCheckIn);
  const checkOut = parseDate(IsoCheckOut);

  const nights = checkOut.diff(checkIn, "day");
  if (nights <= 0) return { error: "Invalid dates" };
  return nights;
};

export const sqlOverlap = (
  existingCheckInIso,
  existingCheckOutIso,
  newCheckInIso,
  newCheckOutIso,
) => {
  const existingStart = parseDate(existingCheckInIso);
  const existingEnd = parseDate(existingCheckOutIso);
  const newStart = parseDate(newCheckInIso);
  const newEnd = parseDate(newCheckOutIso);

  return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
};
