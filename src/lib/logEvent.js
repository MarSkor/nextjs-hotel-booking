import { Client } from "@upstash/workflow";
import config from "./config";
import { headers } from "next/headers";

const client = new Client({ token: config.env.upstash.qstashToken });

export const logEvent = async ({ actorId, type, targetId, metadata }) => {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent");
  const ip = headerList.get("x-forwarded-for") || "unknown";

  await client.trigger({
    url: `${config.env.apiEndpoint}/api/workflows/log-activity`,
    body: {
      actorId,
      type,
      targetId,
      metadata,
      ip,
      userAgent,
    },
    retries: 3,
  });
};
