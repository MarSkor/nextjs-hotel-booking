import { sendEmail } from "@/lib/email";
import { serve } from "@upstash/workflow/nextjs";

export const { POST } = serve(async (context) => {
  const { fullname, email } = context.requestPayload;

  await context.run("send-delete-account-confirmation", async () => {
    console.log("send-delete-account-confirmation");
    await sendEmail({
      email,
      subject: "Security Alert: Account Deletion Confirmation",
      html: `
      <h2>Hi, ${fullname}!</h2>
      <p>We're sad to see you go, but your account and all your data has now been permanently deleted.</p>
      `,
    });
  });

  return new Response("Account Deleted.");
});
