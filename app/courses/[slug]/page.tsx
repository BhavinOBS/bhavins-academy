import { notFound } from "next/navigation";
import { courses } from "@/lib/courses";
import CourseClientPage from "./CourseClientPage";

// ✅ This file should NOT have "use client"
export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // unwrap Promise in Next.js 16
  const course = courses.find((c) => c.slug === slug);

  if (!course) notFound();

  // ✅ Pass the course to the client component for rendering
  return <CourseClientPage course={course} />;
}

