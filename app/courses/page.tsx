import { courses } from "@/lib/courses";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* 🌟 Hero Section */}
      <section className="text-center py-16 bg-gradient-to-b from-white to-blue-50">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Explore Our Courses</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Enhance your IT skills with high-quality, professional training designed for all levels.
        </p>
      </section>

      {/* 💡 Course Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
            <p className="text-gray-600 text-sm mb-4">{course.description}</p>

            <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
              {course.topics?.slice(0, 3).map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>

            <p className="text-blue-600 text-sm mt-2 italic">...more topics</p>

        <div className="mt-6 flex gap-3">
  <Link
    href={`/courses/${course.slug}/details`}
    className="flex-1 text-center bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
    style={{ color: "#fff" }}
  >
    View Details
  </Link>
  <Link
    href={`/courses/${course.slug}`}
    className="flex-1 text-center border border-blue-600 text-blue-600 font-semibold py-2 rounded-md hover:bg-blue-50 transition-all duration-200 focus:ring-2 focus:ring-blue-200 focus:outline-none"
  >
    Start Course
  </Link>
</div>
          </div>
        ))}
      </section>
    </main>
  );
}

