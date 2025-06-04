/** @type {import('next').NextConfig} */
import path from "node:path";

const nextConfig = {
  sassOptions: {
    implementation: "sass-embedded",
    additionalData: `@use "${path
      .join(process.cwd(), "./src/styles/_mantine")
      .replace(/\\/g, "/")}" as mantine;`,
  },
  images: {
    localPatterns: [
      {
        pathname: "/assets/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
