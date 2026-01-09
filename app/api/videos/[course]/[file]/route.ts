import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ course: string; file: string }> }
) {
  // ✅ Await params (Next.js 16+)
  const { course, file } = await context.params;

  // ✅ Step 1: Verify request origin
  const referer = req.headers.get("referer") || "";
  const allowedOrigin = "http://localhost:3000"; // ⚠️ change to your domain later

  if (!referer.startsWith(allowedOrigin)) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  // ✅ Step 2: Locate the secure video file
  const videoPath = path.join(process.cwd(), "private_videos", course, file);

  if (!fs.existsSync(videoPath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const stat = fs.statSync(videoPath);
  const range = req.headers.get("range");

  // ✅ Step 3: Handle full video or partial (range) requests
  if (!range) {
    const fullStream = fs.createReadStream(videoPath);
    return new NextResponse(fullStream as any, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": stat.size.toString(),
      },
    });
  }

  // Parse the byte range header
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
  const chunkSize = end - start + 1;

  const fileStream = fs.createReadStream(videoPath, { start, end });
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize.toString(),
    "Content-Type": "video/mp4",
  };

  // ✅ Step 4: Stream only if authorized
  return new NextResponse(fileStream as any, { status: 206, headers });
}

