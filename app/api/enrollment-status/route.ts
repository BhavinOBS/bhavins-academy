import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get("courseSlug");

  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !courseSlug) {
    return NextResponse.json({ isEnrolled: false });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { enrollments: { include: { course: true } } },
  });

  const enrolled = user?.enrollments.some((e) => e.course.slug === courseSlug);
  return NextResponse.json({ isEnrolled: !!enrolled });
}
