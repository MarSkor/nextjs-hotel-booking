import { serve } from "@upstash/workflow/nextjs";
import { Redis } from "@upstash/redis";
import { sendEmail } from "@/lib/email";

const redis = Redis.fromEnv();

export const { POST } = serve(async (context) => {
  const { email, name, title, checkIn, checkOut, totalPrice } =
    context.requestPayload;

  await context.run("send-booking-confirmation", async () => {
    await sendEmail({
      email,
      subject: `Booking Confirmation - ${title}`,
      html: `
        <h2>Thank you, ${name}!</h2>
        <p>Your booking for <strong>${title} is confirmed!</strong></p>
        <p>Check-in: ${new Date(checkIn).toLocaleDateString()}</p>
        <p>Check-out: ${new Date(checkOut).toLocaleDateString()}</p>
        <p>Total: $${totalPrice}</p>
        <hr/>
        <p>Demo email.</p>
        `,
    });
  });

  await context.run("send-host-notification", async () => {
    await sendEmail({
      email: "host@holidaze-project.martinelog.dev",
      subject: `New Booking - ${title}`,
      html: `<p>${name} booked <strong>${title}</strong> from ${checkIn} to ${checkOut}</p>`,
    });
  });

  await context.run("log-booking", async () => {
    await redis.set(`booking:email:${email}:${Date.now()}`, {
      title,
      date: new Date().toISOString(),
    });
  });
});
