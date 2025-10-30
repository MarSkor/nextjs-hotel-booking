import { useState } from "react";
import { SimpleGrid, ActionIcon, Box } from "@mantine/core";
import { IKImage, IKVideo } from "imagekitio-next";
import { IconDelete } from "@/components/icons";

const ImageThumbnail = ({ value, type = "image", onDelete, disabled }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!value || Array.isArray(value) || value.length === 0) return null;

  //multiple file upload, look at later
  if (Array.isArray(value) && value.length > 0) {
    return (
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm" mt="sm">
        {value.map((file, i) => (
          <Box className="fileUpload__wrapper" key={i}>
            <IKImage
              path={file.filePath}
              alt={file.filePath}
              width={200}
              height={150}
              style={{
                borderRadius: "8px",
                objectFit: "cover",
                width: "100%",
                height: "auto",
              }}
            />
            <ActionIcon
              className="fileUpload__delete"
              color="red"
              variant="filled"
              aria-label="Delete"
              onClick={() => handleDelete(file.fileId)}
              disabled={isPending}
            >
              <IconDelete
                height={18}
                width={18}
                onClick={() => onDelete(file.fileId)}
              />
            </ActionIcon>
          </Box>
        ))}
      </SimpleGrid>
    );
  }

  const handleDelete = async () => {
    if (!value?.fileId) return;
    setIsDeleting(true);
    const res = await onDelete(value.fileId);
    setIsDeleting(false);
    if (!res?.success) {
      console.error("Failed to delete image thumbnail");
    } else {
      console.log("Image deleted successfully");
    }
  };

  // single file upload
  if (type === "image" && value?.filePath) {
    return (
      <Box className="fileUpload__wrapper">
        <IKImage
          path={value.filePath}
          alt={value.filePath}
          width={600}
          height={350}
          style={{
            borderRadius: "8px",
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
        <ActionIcon
          className="fileUpload__delete"
          color="red"
          variant="filled"
          aria-label="Delete"
          type="button"
          disabled={isDeleting || disabled}
          loading={isDeleting || disabled}
          loaderProps={{ type: "oval" }}
          onClick={handleDelete}
        >
          <IconDelete
            height={18}
            width={18}
            color="var(--mantine-color-white)"
          />
        </ActionIcon>
      </Box>
    );
  } else if (
    // needs testing
    type === "video" && value?.filePath ? (
      <Box className="fileUpload__wrapper">
        <IKVideo
          path={file.filePath}
          controls={true}
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
        <ActionIcon
          className="fileUpload__delete"
          color="red"
          variant="filled"
          aria-label="Delete"
          type="submit"
          loading={isPending}
          disabled={isPending}
          onClick={handleDelete}
        >
          <IconDelete
            height={18}
            width={18}
            color="var(--mantine-color-white)"
          />
        </ActionIcon>
      </Box>
    ) : null
  )
    return null;
};

export default ImageThumbnail;
