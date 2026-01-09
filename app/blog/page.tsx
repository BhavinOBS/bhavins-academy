import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BlogPage() {
  const posts = await prisma.blog.findMany({
    orderBy: { date: "desc" },
  });

  // ✅ Helper: Strip HTML tags for preview
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 py-16 px-6">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
          Bhavin’s Academy Blog
        </h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No blog posts available yet.
          </p>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:shadow-md transition"
              >
                <h2 className="text-2xl font-bold text-blue-700 mb-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                  {new Date(post.date).toLocaleDateString()} • {post.author}
                </p>

                {/* ✅ Show clean text preview (first 200 chars) */}
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {stripHtml(post.content).slice(0, 200)}...
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

