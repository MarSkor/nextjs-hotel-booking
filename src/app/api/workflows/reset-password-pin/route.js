import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/email";

export const { POST } = serve(async (context) => {
  const { email, code } = context.requestPayload;

  await context.run(
    "send-password-reset-code",
    async () => {
      await sendEmail({
        email,
        subject: "Reset Password Code",
        html: `
        <p>Your reset code:</p>
        <h2>${code}</h2>

        <p>This code expires in 10 minutes.</p>
      `,
      });
    },
    { idempotencyKey: `password-reset:${email}` }
  );
});
