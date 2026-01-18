import config from "@/lib/config";
import ImageKit from "imagekit";

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

export const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});
