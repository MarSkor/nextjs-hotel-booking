import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/email";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema/users";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) return "non-active";

  const lastActivityDate = new Date(user[0].lastActivityDate);
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();
  if (
    timeDifference > THREE_DAYS_IN_MS &&
    timeDifference <= THIRTY_DAYS_IN_MS
  ) {
    return "non-active";
  }
  return "active";
};

export const { POST } = serve(async (context) => {
  const { email, fullName } = context.requestPayload;

  //Welcome email
  await context.run("new-signup", async () => {
    await sendEmail({
      email,
      subject: "Welcome to Holidaze",
      html: `<h3>Welcome ${fullName}</h3>`,
    });
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "Are you still there?",
          html: `<h3>Hey ${fullName}, it's time to book a trip!</h3>`,
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
          email,
          subject: "Welcome back!",
          html: `<h3>Welcome back ${fullName}!</h3>`,
        });
      });
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});
