import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // ✅ Redirect if not logged in
  if (!session || !session.user?.email) {
    redirect("/auth/signin");
  }

  // ✅ Optional: restrict access to a specific admin email
  const adminEmail = "bhavinobs@gmail.com"; // change if needed
  if (session.user.email !== adminEmail) {
    redirect("/"); // Non-admin users go home
  }

  const activities = await prisma.activity.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 py-16 px-6">
      <section className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
          Admin Dashboard
        </h1>

        {activities.length === 0 ? (
          <p className="text-center text-gray-500">No activity yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">#</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">User</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">Type</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">Details</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((log, index) => (
                  <tr key={log.id} className="hover:bg-blue-50 transition-colors">
                    <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-200 px-4 py-2">{log.user?.email || "Unknown"}</td>
                    <td className="border border-gray-200 px-4 py-2 font-semibold text-blue-600">{log.type}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{log.details}</td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

