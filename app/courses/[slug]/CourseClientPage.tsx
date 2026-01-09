"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Course } from "@prisma/client"; // ✅ Import the type

// ✅ Define prop type explicitly
export default function CourseDetailClient({ course }: { course: Course }) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // ✅ Check if user is enrolled
  useEffect(() => {
    async function checkEnrollment() {
      try {
        const res = await fetch(`/api/enroll/status?courseSlug=${course.slug}`);
        if (res.ok) {
          const data = await res.json();
          setIsEnrolled(data.enrolled);
        }
      } catch (err) {
        console.error("Enrollment check failed:", err);
      }
    }
    checkEnrollment();
  }, [course.slug]);

  // ✅ Enroll button handler
  async function handleEnroll() {
    try {
      setIsEnrolling(true);
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: course.slug }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to enroll");

      setIsEnrolled(true);
      alert("✅ Enrollment successful!");
    } catch (err: any) {
      alert(`❌ Enrollment failed: ${err.message}`);
    } finally {
      setIsEnrolling(false);
    }
  }

  return (
    <section className="max-w-5xl mx-auto text-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-6">{course.description}</p>

        {isEnrolled ? (
          <Link
            href={`/courses/${course.slug}`}
            className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-md shadow hover:bg-green-700 transition-all duration-200"
          >
            Continue Course →
          </Link>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={isEnrolling}
            className={`px-8 py-3 text-lg font-semibold rounded-md shadow transition-all duration-200 ${
              isEnrolling
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isEnrolling ? "Enrolling..." : "Enroll Now"}
          </button>
        )}
      </div>
    </section>
  );
}

