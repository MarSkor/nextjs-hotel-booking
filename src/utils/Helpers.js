import dayjs from "dayjs";

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const mathRound = (num) => Math.round(num * 10) / 10;

export const formatText = (text) => {
  if (!text) return "";
  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const buildSearchParams = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
};

export const isValidUUID = (id) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id);

export const calculateBookingPrice = (checkIn, checkOut, pricePerNight) => {
  if (!checkIn || !checkOut) return 0;

  const parseCheckIn = dayjs(checkIn);
  const parseCheckOut = dayjs(checkOut);

  const totalNights = parseCheckOut.diff(parseCheckIn, "day");
  const totalPrice = totalNights * pricePerNight;

  return totalPrice;
};

export const truncateString = (string = "", maxLength = 25) =>
  string.length > maxLength ? `${string.substring(0, maxLength)}...` : string;
