import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-semibold mb-4 text-gray-700">
          You’re not signed in
        </h1>
        <Link
          href="/auth/signin"
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Sign In
        </Link>
      </main>
    );
  }

  // Get user info from DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      enrollments: {
        include: { course: true },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">User profile not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6">
      <section className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <div className="flex items-center gap-6 mb-8">
          <Image
            src={session.user.image || "/default-avatar.png"}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full border"
          />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">{user.name || "User"}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Enrolled Courses
          </h2>
          {user.enrollments.length > 0 ? (
            <ul className="space-y-2">
              {user.enrollments.map((enroll) => (
                <li
                  key={enroll.id}
                  className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition"
                >
                  <Link
                    href={`/courses/${enroll.course.slug}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {enroll.course.title}
                  </Link>
                  <p className="text-xs text-gray-500">
                    Enrolled on {new Date(enroll.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No courses enrolled yet.</p>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>
          {user.activities.length > 0 ? (
            <ul className="space-y-2">
              {user.activities.map((a) => (
                <li
                  key={a.id}
                  className="border border-gray-200 rounded-md p-3 bg-gray-50"
                >
                  <p className="font-medium text-gray-700">{a.type}</p>
                  {a.details && (
                    <p className="text-sm text-gray-600">{a.details}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No recent activity.</p>
          )}
        </div>
      </section>
    </main>
  );
}
