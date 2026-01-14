import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/email";

export const { POST } = serve(async (context) => {
  const { oldEmail, newEmail, fullName } = context.requestPayload;

  await context.run("send-email-updated-notification", async () => {
    await sendEmail({
      email: newEmail,
      subject: "Success: Your email is now verified",
      html: `
      <h3>Your email has been updated.</h3>
      <p>Hi, ${fullName}! Your email has now been successfully updated.</p>
      <p>You can now use ${newEmail} to log in</p>
      `,
    });
  });

  await context.run("send-security-alert", async () => {
    await sendEmail({
      email: oldEmail,
      subject: "Security Alert: Your email has been changed",
      html: `
      <h3><Your email has been updated.</h3>
      <p>Hi, ${fullName}! Your email has now been updated.</p>
      <p> If you did not make this change, please contact support immediately."</p>
      `,
    });
  });
});
