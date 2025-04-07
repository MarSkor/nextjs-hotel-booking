import {
  IconDoubleBed,
  IconSingleBed,
  IconMultipleUsers,
  IconUser,
  IconInfoCircle,
} from "@/components/icons";

const IconSwitch = (icon) => {
  switch (icon) {
    case "single-bed":
      return <IconSingleBed color="$clr-brown-200" />;
    case "double-bed":
      return <IconDoubleBed color="$clr-brown-200" />;
    case "multiple-users":
      return <IconMultipleUsers color="$clr-brown-200" />;
    case "single-user":
      return <IconUser color="$clr-brown-200" />;
    default:
      <IconInfoCircle color="$clr-brown-200" />;
      break;
  }
};

export default IconSwitch;
