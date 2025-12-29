import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/email";

export const { POST } = serve(async (context) => {
  const { oldEmail, newEmail, fullName } = context.requestPayload;

  await context.run("send-email-updated-notification", async () => {
    await sendEmail({
      email: newEmail,
      subject: "Your email was updated",
      html: `
      <h3>Your email has been updated.</h3>
      <p>Hi, ${fullName}! Your email has now been updated.</p>
      `,
    });
  });

  await context.run("send-security-alert", async () => {
    await sendEmail({
      email: oldEmail,
      subject: "Security notice: email changed",
      html: `
      <h3><Your email has been updated.</h3>
      <p>Hi, ${fullName}! Your email has now been updated.</p>
      `,
    });
  });

  console.log("updated email notification: sent");
});
