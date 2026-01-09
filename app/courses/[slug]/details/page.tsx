import { courses } from "@/lib/courses";
import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  // ✅ The client-side logic (enroll button, states, etc.) is handled inside CourseDetailClient.tsx
  return <CourseDetailClient course={course} />;
}

