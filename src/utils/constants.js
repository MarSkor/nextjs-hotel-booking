import { IconDoubleBed, IconSingleBed } from "@/components/icons";

export const bedTypes = [
  { key: "queenBeds", label: "Queen Bed", icon: <IconDoubleBed /> },
  { key: "fullBeds", label: "Full Bed", icon: <IconDoubleBed /> },
  { key: "twinBeds", label: "Twin Bed", icon: <IconSingleBed /> },
];

export const propertyType = [
  { label: "All", value: "all" },
  { label: "Hotel", value: "hotel" },
  { label: "Guesthouse", value: "guesthouse" },
  { label: "Bed & Breakfast", value: "bed_and_breakfast" },
];

export const sortByData = [
  { label: "Price (Lowest First)", value: "price_asc" },
  { label: "Price (Highest First)", value: "price_desc" },
  { label: "Guest Capacity (Low–High)", value: "guests_asc" },
  { label: "Guest Capacity (High–Low)", value: "guests_desc" },
  // other data to sort accs. can be added here but for the time being this is enough
];

export const guestAmount = [
  { label: "All", value: "all" },
  { label: "1–2 Guests", value: "1-2" },
  { label: "3–4 Guests", value: "3-4" },
  { label: "5+ Guests", value: "5" },
];

export const PLACEHOLDER_IMAGE_PATH =
  "defaults/600x400_DxM717i9q.svg?updatedAt=1761824349446";
