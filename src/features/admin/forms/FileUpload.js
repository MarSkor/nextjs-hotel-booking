"use client";
import config from "@/lib/config";
import { ImageKitProvider, IKUpload } from "imagekitio-next";
import { useRef, useState, useEffect, useTransition } from "react";
import { IconUpload } from "@/components/icons";
import { FileInput, Progress } from "@mantine/core";
import ImageThumbnail from "../components/ImageThumbnail";
import InputPill from "@/features/admin/components/InputPill";
import { mantineNotify } from "@/lib/mantineNotify";
import { getDisplayName } from "@/utils/Helpers";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const res = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Request failed with status ${res.status}: ${errorText}`);
    }
    const data = await res.json();
    const { signature, expire, token } = data;
    return { signature, token, expire };
  } catch (err) {
    throw new Error(`Authentication request failed: ${err.message}`);
  }
};

const FileUpload = ({
  onFileChange,
  type = "image",
  accept = "image/*",
  description,
  placeholder,
  label,
  multiple = false,
  folder,
  error,
  value,
  accId,
  onDelete,
}) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState(value || null); //to view the images locally
  const [progress, setProgress] = useState(0);
  const [isPending] = useTransition();

  const onValidate = (file) => {
    if (type === "image") {
      if (file.size > 5 * 1024 * 1024) {
        mantineNotify.error(
          "File size too large",
          "File must be less than 5MB in size"
        );
        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        mantineNotify.error(
          "File size too large",
          "File must be less than 50MB in size."
        );
        return false;
      }
    }
    return true;
  };

  const onError = (error) => {
    console.log("fileupload error-", error);
    mantineNotify.error(
      `${type} upload failed.`,
      "Your image could not be uploaded. Please try again."
    );
  };

  const onSuccess = (res) => {
    // console.log("res", res);
    const uploadedFile = {
      fileId: res.fileId,
      filePath: res.filePath,
      url: `${config.env.imagekit.urlEndpoint}${res.filePath}`,
    };

    if (onFileChange) {
      onFileChange(uploadedFile);
    }
    setFile(uploadedFile);
    setProgress(100);
    mantineNotify.success(
      `${type} uploaded successfully.`,
      `${res.filePath} uploaded successfully`
    );
  };

  const handleDelete = async (fileId) => {
    const res = await onDelete(fileId);
    if (res?.success) {
      setFile(null);
    }
    return res;
  };

  useEffect(() => {
    if (value && value !== file) {
      if (typeof value === "string") {
        setFile({
          fileId: null,
          filePath: value,
          url: `${config.env.imagekit.urlEndpoint}${value}`,
        });
      } else {
        setFile(value);
      }
    }
    // console.log("FileUpload value:", value);
  }, [value]);

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        multiple={multiple}
        useUniqueFileName={true}
        validateFile={onValidate}
        folder={folder}
        accept={accept}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) => {
          setProgress(Math.round((loaded / total) * 100));
        }}
      />
      <FileInput
        mb={"sm"}
        size="sm"
        label={label}
        description={description}
        placeholder={placeholder}
        value={file}
        onChange={setFile}
        multiple={multiple} /* look at multiple file uploads later */
        valueComponent={InputPill}
        leftSection={
          <IconUpload width={20} height={20} color="var(--button-color)" />
        }
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            ikUploadRef.current?.click();
          }
        }}
        error={error}
      />

      {/* UI for progress upload  */}
      {progress > 0 && progress < 100 && (
        <Progress.Root size={"lg"} mb={"lg"} pos={"relative"}>
          <Progress.Section
            aria-label="Uploading progress"
            value={progress}
            animated
            color="blue"
          />
          <Progress.Label
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontWeight: 500,
            }}
          >
            {progress}%
          </Progress.Label>
        </Progress.Root>
      )}
      {value && (
        <ImageThumbnail
          accId={accId}
          value={value}
          type={type}
          onDelete={handleDelete}
          disabled={isPending}
        />
      )}
    </ImageKitProvider>
  );
};

export default FileUpload;
