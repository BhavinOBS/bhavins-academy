"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CourseDetailClient({ course }) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // ✅ Check enrollment status on mount
  useEffect(() => {
    async function fetchEnrollment() {
      try {
        const res = await fetch(`/api/enroll/status?courseSlug=${course.slug}`);
        if (res.ok) {
          const data = await res.json();
          setIsEnrolled(data.enrolled);
        }
      } catch (err) {
        console.error("Failed to check enrollment:", err);
      }
    }
    fetchEnrollment();
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

      if (res.ok) {
        alert("🎉 You’ve successfully enrolled in this course!");
        setIsEnrolled(true); // ✅ Update instantly
      } else {
        alert("⚠️ Please sign in to enroll in this course.");
      }
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Something went wrong. Try again later.");
    } finally {
      setIsEnrolling(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* 🌟 Hero Section */}
      <section className="bg-gradient-to-b from-white to-blue-50 py-20 px-6 text-center shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-4">
            {course.title}
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {course.description}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          
          <Link
            href={`/courses/${course.slug}`}
            className={`inline-block px-8 py-3 rounded-md font-semibold transition-all duration-200 shadow-sm border border-blue-700 ${
            isEnrolled
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              style={{ color: "white", textShadow: "0 0 2px rgba(0,0,0,0.3)" }}
            >
              {isEnrolled ? "Continue Course →" : "Start Course →"}
            </Link>

            {/* ✅ Only show this if not enrolled */}
            {!isEnrolled && (
            <button
          onClick={async () => {
            try {
              const res = await fetch("/api/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ sends cookies/session
                body: JSON.stringify({ courseSlug: course.slug }),
              });

              if (res.status === 401) {
                alert("⚠️ Please sign in to enroll in this course.");
              } else if (res.ok) {
                alert("🎉 You’ve successfully enrolled in this course!");
              } else {
                const err = await res.text();
                alert("❌ Enrollment failed: " + err);
              }
            } catch (err) {
              console.error("Enrollment failed:", err);
              alert("⚠️ Something went wrong during enrollment.");
            }
          }}
          className="px-8 py-3 border border-blue-600 text-blue-600 font-semibold rounded-md hover:bg-blue-50 transition-all"
        >
          Enroll Now
        </button>
            )}
          </div>
        </div>
      </section>

      {/* 💡 Course Overview */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            What you’ll learn
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-gray-700 leading-relaxed">
            {course.topics?.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>

        {/* 📊 Course Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <p className="text-gray-500 text-sm">Course Duration</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              ~{course.lessons.length * 3} mins
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <p className="text-gray-500 text-sm">Lessons</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              {course.lessons.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <p className="text-gray-500 text-sm">Difficulty</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">Beginner</p>
          </div>
        </div>

        {/* 🔙 Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="inline-block px-6 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
          >
            ← Back to Courses
          </Link>
        </div>
      </section>
    </main>
  );
}

