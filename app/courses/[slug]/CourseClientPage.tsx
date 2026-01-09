"use client";

import { useState, useEffect } from "react";
import SecureVideo from "@/components/SecureVideo";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { Course, Lesson } from "@prisma/client";

// ✅ Define type
interface CourseWithLessons extends Course {
  lessons: Lesson[];
}

export default function CourseClientPage({ course }: { course: CourseWithLessons }) {
  const [activeLesson, setActiveLesson] = useState(course.lessons[0]);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // ✅ Check enrollment status
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

  // ✅ Load lesson content (markdown/html)
  useEffect(() => {
    const loadLesson = async () => {
      if (activeLesson?.textUrl) {
        try {
          const res = await fetch(activeLesson.textUrl);
          const data = await res.text();

          if (activeLesson.textUrl?.endsWith(".md")) {
            const { content } = matter(data);
            const processed = await remark().use(html).process(content);
            setMarkdownContent(processed.toString());
          } else if (activeLesson.textUrl?.endsWith(".html")) {
            const cleanHTML = data
              .replace(/<!DOCTYPE[^>]*>/gi, "")
              .replace(/<html[^>]*>/gi, "")
              .replace(/<\/html>/gi, "")
              .replace(/<body[^>]*>/gi, "")
              .replace(/<\/body>/gi, "");
            setMarkdownContent(cleanHTML);
          } else {
            setMarkdownContent(`<pre>${data}</pre>`);
          }
        } catch (err) {
          console.error("Error loading lesson content:", err);
          setMarkdownContent(null);
        }
      } else {
        setMarkdownContent(null);
      }
    };

    loadLesson();
  }, [activeLesson]);

  return (
    <main className="flex flex-col md:flex-row max-w-[1600px] mx-auto px-6 py-10 gap-8 bg-gray-50 text-gray-800">
      {/* 🎬 Main content area */}
      <div className="flex-1 bg-white shadow-sm rounded-lg p-6 prose prose-lg max-w-none">
        {activeLesson.isFree || isEnrolled ? (
          activeLesson.videoUrl ? (
            <SecureVideo src={activeLesson.videoUrl} title={activeLesson.title} />
          ) : markdownContent ? (
            <div dangerouslySetInnerHTML={{ __html: markdownContent }} />
          ) : (
            <p className="text-gray-500 italic">Select a lesson to begin.</p>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">🔒 This lesson is locked.</p>
            <p className="text-sm text-gray-500 mb-6">
              Enroll in this course to unlock all lessons.
            </p>
            <a
              href={`/courses/${course.slug}/details`}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Enroll Now
            </a>
          </div>
        )}
      </div>

      {/* 📚 Sidebar navigation */}
      <aside className="w-full md:w-72 bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4 h-fit">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Chapters</h2>
        <ul className="space-y-2">
          {course.lessons.map((lesson) => (
            <li key={lesson.id}>
              <button
                onClick={() =>
                  (lesson.isFree || isEnrolled) && setActiveLesson(lesson)
                }
                disabled={!lesson.isFree && !isEnrolled}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition ${
                  activeLesson?.id === lesson.id
                    ? "bg-blue-600 text-white"
                    : lesson.isFree || isEnrolled
                    ? "text-gray-700 hover:bg-blue-50"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {lesson.title}{" "}
                {!lesson.isFree && !isEnrolled && (
                  <span className="ml-2 text-xs">🔒</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}

