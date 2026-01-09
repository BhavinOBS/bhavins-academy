import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  req: NextRequest,
  { params }: { params: { course: string; file: string } }
) {
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
    const res = new NextResponse(fileBuffer);
    res.headers.set("Content-Type", "video/mp4");
    return res;
  } catch (error) {
    console.error("💥 Video API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

