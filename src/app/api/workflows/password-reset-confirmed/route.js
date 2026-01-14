import { sendEmail } from "@/lib/email";
import { serve } from "@upstash/workflow/nextjs";

export const { POST } = serve(async (context) => {
  const { email } = context.requestPayload;

  const date = new Date();

  await context.run("send-password-change-update", async () => {
    await sendEmail({
      email,
      subject: "Security Update.",
      html: `
        <h3>Your password was changed.</h3>
        <p>At: ${date}</p>
        `,
    });
  });
});
