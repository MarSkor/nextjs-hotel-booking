"use server";

import { db } from "@/database/drizzle";
import { contactMessages } from "@/database/schema";
import { logEvent } from "@/lib/logEvent";
import { verificationStatus } from "@/lib/verification-status";
import { revalidatePath } from "next/cache";

export const sendContactMessage = async (data) => {
  try {
    const [newMessage] = await db
      .insert(contactMessages)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        subject: data.subject,
        message: data.message,
      })
      .returning();

    await logEvent({
      actorId: null,
      type: "CONTACT_FORM_SUBMITTED",
      targetId: newMessage.id,
      metadata: { email: data.email, subject: data.subject },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    // console.log("contact form error: ", error);
    return {
      success: false,
      error: verificationStatus.ERROR,
      message: "Failed to send message",
    };
  }
};
