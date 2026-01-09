import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { course: string; file: string } }
) {
  const { course, file } = params;

  // 🧱 Build file path securely
  const videoPath = path.join(process.cwd(), "private_videos", course, file);

  if (!fs.existsSync(videoPath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const stat = fs.statSync(videoPath);
  const range = req.headers.get("range");

  if (!range) {
    const fullStream = fs.createReadStream(videoPath);
    return new NextResponse(fullStream, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": stat.size.toString(),
      },
    });
  }

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

  return new NextResponse(fileStream as any, { status: 206, headers });
}

