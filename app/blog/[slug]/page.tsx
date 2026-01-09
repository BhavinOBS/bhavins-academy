import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    console.error("❌ Missing slug in params");
    notFound();
  }

  const post = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!post) {
    console.error("❌ Blog not found:", slug);
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 py-16 px-6">
      <article className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {new Date(post.date).toLocaleDateString()} • {post.author}
        </p>

        {/* ✅ Render rich text HTML properly */}
        <div
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}

