import { IconDoubleBed, IconSingleBed } from "@/components/icons";

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const slugify = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const bedTypes = [
  { key: "queenBeds", label: "Queen Bed", icon: <IconDoubleBed /> },
  { key: "fullBeds", label: "Full Bed", icon: <IconDoubleBed /> },
  { key: "twinBeds", label: "Twin Bed", icon: <IconSingleBed /> },
];
