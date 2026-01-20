import { db } from "@/database/drizzle";
import { bookings } from "@/database/schema";
import { and, eq, lt } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req) {
  if (
    req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const res = await db
      .update(bookings)
      .set({ status: "CANCELLED" })
      .where(
        and(eq(bookings.status, "PENDING"), lt(bookings.createdAt, oneHourAgo)),
      )
      .returning();

    if (res.length > 0) {
      revalidateTag("admin-stats");
    }

    return NextResponse.json({ success: true, cleaned: res.length });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
