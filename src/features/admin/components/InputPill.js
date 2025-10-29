import { Pill, PillGroup } from "@mantine/core";

const InputPill = ({ value }) => {
  if (!value) return null;
  if (Array.isArray(value)) {
    return (
      <PillGroup>
        {value.map((file, i) => {
          const label = file.name || file.filePath?.split("/").pop();
          file.url?.split("/").pop() || "File";

          return <Pill key={i}>{label}</Pill>;
        })}
      </PillGroup>
    );
  }

  //returns the filename after /accommodations/<imageFileNameReturned.jpg>
  const label =
    value.name ||
    value.filePath?.split("/").pop() ||
    value.url?.split("/").pop() ||
    "Uploaded file";

  return <Pill>{label || value?.filePath || value?.name}</Pill>;
};

export default InputPill;
