import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/email";
import config from "@/lib/config";

export const { POST } = serve(async (context) => {
  const { newEmail, fullName, token, userId } = context.requestPayload;

  const verifyUrl = `${config.env.apiEndpoint}/verify-email?token=${token}`;

  await context.run(
    "send-verification-email",
    async () => {
      await sendEmail({
        email: newEmail,
        subject: "Verify your new email.",
        html: `
      <h3>Verify your email.</h3>
      <p>Hi! ${fullName}, you've requested to change your email.</p>
      <a href=${verifyUrl}>Confirm your email</a>
      <p>It will expire in 10 minutes.</p>
      `,
      });
    },
    { idempotencyKey: `verify-email:${token}` }
  );

  console.log("workflow:verify-email:sent", {
    userId,
    email: newEmail,
  });
});
