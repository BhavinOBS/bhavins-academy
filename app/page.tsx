import Link from "next/link";
import { courses } from "@/lib/courses";

export default function HomePage() {
  const featured = courses.slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 🌤️ Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Learn IT Skills Online</h1>
        <p className="hero-subtitle">
          Explore high-quality IT courses taught by professionals. Learn, grow, and get certified!
        </p>

        <div className="mt-8">
          <Link href="/courses" className="btn-primary inline-block">
            Browse Courses
          </Link>
        </div>
      </section>

      {/* 📚 Popular Courses Section */}
      <section className="py-16 bg-white">
        <h2 className="section-title">Popular Courses</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {featured.map((course) => (
            <div
              key={course.id}
              className="card text-left hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <Link
                href={`/courses/${course.slug}`}
                className="text-blue-600 font-medium hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

