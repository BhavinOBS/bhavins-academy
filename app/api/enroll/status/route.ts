import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get("courseSlug");

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ enrolled: false });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ enrolled: false });
  }

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug || "" },
  });

  if (!course) {
    return NextResponse.json({ enrolled: false });
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: user.id, courseId: course.id },
  });

  return NextResponse.json({ enrolled: !!enrollment });
}

