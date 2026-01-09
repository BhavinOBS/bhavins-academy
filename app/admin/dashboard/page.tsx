import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // ✅ Only allow logged-in admin (for now, any logged-in user)
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // ✅ Fetch data summaries
  const [userCount, courseCount, enrollmentCount, activityCount] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.activity.count(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 text-gray-800">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          📊 Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard label="Users" value={userCount} color="from-blue-500 to-blue-600" />
          <DashboardCard label="Courses" value={courseCount} color="from-green-500 to-green-600" />
          <DashboardCard
            label="Enrollments"
            value={enrollmentCount}
            color="from-purple-500 to-purple-600"
          />
          <DashboardCard
            label="Activity Logs"
            value={activityCount}
            color="from-pink-500 to-pink-600"
          />
        </div>
      </section>
    </main>
  );
}

// 🎨 Small reusable card component
function DashboardCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`bg-gradient-to-r ${color} text-white rounded-xl shadow-md p-6 text-center transform hover:scale-[1.02] transition`}
    >
      <p className="text-sm uppercase opacity-80">{label}</p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  );
}

