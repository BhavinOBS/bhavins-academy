import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Handles serving course videos dynamically
 */
export async function GET(req: NextRequest, context: { params: Promise<{ course: string; file: string }> }) {
  const { course, file } = await context.params; // ✅ await the params promise

  try {
    const videoPath = path.join(process.cwd(), "public", "courses", course, file);

    if (!fs.existsSync(videoPath)) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const videoBuffer = fs.readFileSync(videoPath);
    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  } catch (error) {
    console.error("💥 Error serving video:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

