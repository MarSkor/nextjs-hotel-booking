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
      return <IconSingleBed height={14} width={14} color="$clr-brown-2" />;
    case "double-bed":
      return <IconDoubleBed height={14} width={14} color="$clr-brown-2" />;
    case "multiple-users":
      return <IconMultipleUsers height={14} width={14} color="$clr-brown-2" />;
    case "single-user":
      return <IconUser height={14} width={14} color="$clr-brown-2" />;
    default:
      <IconInfoCircle />;
      break;
  }
};

export default IconSwitch;
