import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

/**
 * Example: /api/videos?course=M365-1&file=intro.mp4
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const course = searchParams.get("course");
    const file = searchParams.get("file");

    if (!course || !file) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const videoPath = path.join(process.cwd(), "public", "courses", course, file);

    if (!fs.existsSync(videoPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(videoPath);
    return new NextResponse(fileBuffer, {
      headers: { "Content-Type": "video/mp4" },
    });
  } catch (err) {
    console.error("💥 Video streaming failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

