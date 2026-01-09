import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
// ✅ FIXED: correct import path to auth route
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { logActivity } from "@/lib/activityLogger"; // keep this absolute path (works with tsconfig.json)

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("🧠 Enroll API called...");

  const session = await getServerSession(authOptions);
  console.log("🔑 Session:", session);

  if (!session || !session.user?.email) {
    console.log("❌ No session found.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseSlug } = await req.json();

  try {
    // ✅ Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.error("❌ User not found.");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Find course
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
    });

    if (!course) {
      console.error("❌ Course not found:", courseSlug);
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // ✅ Check if already enrolled
    const existing = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseId: course.id },
    });

    if (existing) {
      console.log("⚠️ Already enrolled:", courseSlug);
      return NextResponse.json({ message: "Already enrolled" });
    }

    // ✅ Create enrollment
    await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
    });

    // ✅ Log activity
    await logActivity(user.id, "ENROLL", `Enrolled in ${courseSlug}`);

    console.log(`✅ Enrollment success for ${session.user.email} in ${courseSlug}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("💥 Enrollment failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

