// lib/activityLogger.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Log a user activity to the database.
 * @param userId number
 * @param type string  (e.g., "LOGIN", "ENROLL", "SIGNUP")
 * @param details string | null
 */
export async function logActivity(
  userId: number | null,
  type: string,
  details?: string
) {
  try {
    if (!userId) {
      console.warn("⚠️ No userId provided to logActivity()");
      return;
    }

    await prisma.activity.create({
      data: {
        userId,
        type,
        details: details || null,
      },
    });

    console.log(`🧾 Activity logged: ${type} (${details || "no details"})`);
  } catch (err) {
    console.error("💥 Failed to log activity:", err);
  }
}

