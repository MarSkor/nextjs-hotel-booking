import { sendEmail } from "@/lib/email";
import { serve } from "@upstash/workflow/nextjs";

export const { POST } = serve(async (context) => {
  const { email } = context.requestPayload;

  await context.run("send-delete-account-confirmation", async () => {
    console.log("send-delete-account-confirmation");
    await sendEmail({
      email,
      subject: "Goodbye from Holidaze.",
      html: `
      <p>We have processed your request, and your account, along with all personal data (name, email, payment methods), has been permanently deleted from our systems.</p>
      <p>Please note that any reviews you have posted will remain on our site to help other travelers, but they have been made anonymous and cannot be linked back to you.</p>
      <p>We are sorry to see you go and hope to welcome you back in the future.</p>
      `,
    });
  });

  return new Response("Account Deleted.");
});
