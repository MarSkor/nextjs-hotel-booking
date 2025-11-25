import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/email";
import redis from "@/database/redis";

export const { POST } = serve(async (context) => {
  const { email, name, title, checkIn, checkOut, totalPrice, message } =
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
        <p>Price Total: $${totalPrice}</p>
        <p>${message}</p>
        <hr />
        <p>Demo email.</p>
        `,
    });
  });

  await context.run("send-host-notification", async () => {
    await sendEmail({
      email: `host${process.env.RESEND_FROM_BASE_EMAIL_ADDRESS}`,
      subject: `New Booking - ${title}`,
      html: `
      <p>${name} booked <strong>${title}</strong>.</p>
      <p>Check-in: ${new Date(checkIn).toLocaleDateString()}</p>
      <p>Check-out: ${new Date(checkOut).toLocaleDateString()}</p>
      <p>Price Total: $${totalPrice}</p>
      <p>${message}</p>
      <hr />
      <p>Demo host notification email.</p>
      `,
    });
  });

  await context.run("log-booking", async () => {
    await redis.set(`booking-confirm:email:${email}:${Date.now()}`, {
      email,
      title,
      checkIn: new Date(checkIn).toLocaleDateString(),
      checkOut: new Date(checkOut).toLocaleDateString(),
      sentAt: new Date().toISOString(),
    });
  });
  return { status: "Ok." };
});
