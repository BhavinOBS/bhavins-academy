import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activityLogger";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // ✅ Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // ✅ Hash password and create user
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    // ✅ Log SIGNUP activity
    await logActivity(newUser.id, "SIGNUP", `User registered with email ${email}`);

    console.log(`✅ New user created and logged: ${email}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("💥 Signup failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

