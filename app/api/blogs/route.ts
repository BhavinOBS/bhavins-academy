import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ===========================================
   ✅ GET — Fetch all blogs
=========================================== */
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(blogs);
  } catch (err) {
    console.error("💥 Failed to fetch blogs:", err);
    return NextResponse.json({ error: "Failed to load blogs" }, { status: 500 });
  }
}

/* ===========================================
   ✅ POST — Create a new blog
=========================================== */
export async function POST(req: Request) {
  try {
    const { title, content, author } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const blog = await prisma.blog.create({
      data: { title, content, author, slug },
    });

    return NextResponse.json(blog);
  } catch (err) {
    console.error("💥 Blog creation failed:", err);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

/* ===========================================
   ✅ PUT — Update an existing blog
=========================================== */
export async function PUT(req: Request) {
  try {
    const { id, title, content, author, slug } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        title,
        content,
        author,
        slug: slug
          ? slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
          : undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("💥 Blog update failed:", err);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

/* ===========================================
   ✅ DELETE — Delete a blog by ID
=========================================== */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
    }

    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("💥 Blog deletion failed:", err);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}

