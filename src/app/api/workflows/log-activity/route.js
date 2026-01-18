import { db } from "@/database/drizzle";
import { auditLogs } from "@/database/schema";
import { serve } from "@upstash/workflow/nextjs";

export const { POST } = serve(async (context) => {
  const input = context.requestPayload;

  await context.run("insert-log-to-db", async () => {
    await db.insert(auditLogs).values({
      actorId: input.actorId,
      targetId: input.targetId,
      type: input.type,
      metadata: input.metadata || {},
      ip: input.ip,
      userAgent: input.userAgent,
      createdAt: new Date(),
    });
    return { success: true };
  });
});
