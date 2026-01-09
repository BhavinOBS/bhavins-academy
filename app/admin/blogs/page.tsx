"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    content: "",
    author: "Bhavin Khatri",
    slug: "",
  });
  const [slugPreview, setSlugPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Auto-generate slug
  useEffect(() => {
    const generatedSlug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm((prev) => ({ ...prev, slug: generatedSlug }));
    setSlugPreview(generatedSlug);
  }, [form.title]);

  // ✅ Add / Update Blog
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return alert("Please fill all fields");

    try {
      const res = await fetch("/api/blogs", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save blog");

      await fetchBlogs();
      resetForm();
      alert(isEditing ? "✅ Blog updated!" : "✅ Blog added!");
    } catch (err) {
      console.error("💥 Error saving blog:", err);
      alert("❌ Could not save blog");
    }
  };

  // ✅ Edit Blog
  const handleEdit = (blog: any) => {
    setForm(blog);
    setSlugPreview(blog.slug);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Delete Blog
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch("/api/blogs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete blog");

      await fetchBlogs();
      alert("🗑️ Blog deleted successfully!");
    } catch (err) {
      console.error("💥 Blog deletion failed:", err);
      alert("❌ Could not delete blog");
    }
  };

  // ✅ Reset form
  const resetForm = () => {
    setForm({ id: null, title: "", content: "", author: "Bhavin Khatri", slug: "" });
    setSlugPreview("");
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6">
      <section className="max-w-5xl mx-auto bg-white shadow-md p-8 rounded-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Manage Blog Posts</h1>

        {/* ✅ Add / Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-10">
          <input
            type="text"
            placeholder="Title"
            className="w-full border rounded-md p-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          {slugPreview && (
            <p className="text-sm text-gray-500 -mt-2 mb-2">
              🔗 Slug: <span className="font-mono">{slugPreview}</span>
            </p>
          )}

        {/* ✅ Fixed Rich Text Editor (toolbar always visible + scrollable area) */}
        <div className="bg-white border rounded-md overflow-hidden">
          <div className="quill-container">
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
            />
          </div>
        </div>

          <div className="flex flex-wrap gap-3 pt-6">
            <button
              type="submit"
              className={`px-6 py-2 ${
                isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold rounded-md transition`}
            >
              {isEditing ? "Update Blog" : "Add Blog"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-md transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* ✅ Blog List */}
        <div className="space-y-6">
          {blogs.length === 0 ? (
            <p className="text-gray-500 text-center italic">No blogs yet.</p>
          ) : (
            blogs.map((b) => (
              <div
                key={b.id}
                className="border-b pb-4 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div className="md:w-3/4">
                  <h2 className="text-xl font-semibold text-gray-800">{b.title}</h2>
                  <p
                    className="text-gray-600 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: b.content }}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(b.date).toLocaleDateString()} — {b.author}
                  </p>
                  <p className="text-xs text-gray-400 font-mono mb-2">Slug: {b.slug}</p>
                </div>

                <div className="flex gap-3 mt-3 md:mt-0">
                  <button
                    onClick={() => handleEdit(b)}
                    className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

