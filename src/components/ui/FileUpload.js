"use client";
import config from "@/lib/config";
import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import { useRef, useState } from "react";
import { IconUpload } from "../icons";
import { toast } from "sonner";
import { FileInput, Progress, Pill, PillGroup } from "@mantine/core";

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

const ValueComponent = ({ value }) => {
  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return (
      <PillGroup>
        {value.map((file, index) => (
          <Pill key={index}>{file.name}</Pill>
        ))}
      </PillGroup>
    );
  }

  return <Pill>{value.name}</Pill>;
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
}) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState([]); //to view the images locally
  const [progress, setProgress] = useState(0);

  const onValidate = (file) => {
    if (type === "image") {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large", {
          description: "File must be less than 5MB in size",
        });
        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size too large", {
          description: "File must be less than 50MB in size.",
        });
        return false;
      }
    }
    return true;
  };

  const onError = (error) => {
    console.log("fileupload error-", error);
    toast.error(`${type} upload failed.`, {
      description: "Your image could not be uploaded. Please try again.",
      action: {
        label: "Close",
      },
      position: "top-center",
    });
  };

  const onSuccess = (res) => {
    // console.log("res", res);
    setFile(res);
    setProgress(100);
    // onFileChange(res);
    onFileChange(res.filePath);
    toast.success(`${type} uploaded successfully.`, {
      description: `${res.filePath} uploaded successfully`,
      position: "top-center",
    });
  };

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
        clearable
        label={label}
        description={description}
        placeholder={placeholder}
        value={file}
        onChange={setFile}
        multiple={multiple} /* look at multiple file uploads later */
        valueComponent={ValueComponent}
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
      {progress > 0 && progress !== 100 && (
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

      {/* UI to view images  */}
      {!Array.isArray(file) && file?.filePath && type === "image" ? (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={300}
          style={{ objectFit: "cover" }}
        />
      ) : type === "video" ? (
        <IKVideo
          path={file.filePath}
          controls={true}
          style={{ objectFit: "cover" }}
        />
      ) : null}
    </ImageKitProvider>
  );
};

export default FileUpload;
