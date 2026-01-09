// scripts/seedCourses.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding initial courses...");

  const m365 = await prisma.course.create({
    data: {
      slug: "M365-1",
      title: "Mastering Microsoft 365 - Level 1",
      description:
        "A complete beginner-friendly guide to mastering Microsoft 365 essentials — Outlook, Teams, SharePoint, and OneDrive.",
      lessons: {
        create: [
          {
            title: "Introduction to Microsoft 365",
            duration: "05:30",
            videoUrl: "/courses/M365-1/intro.mp4",
            textUrl: "/courses/M365-1/intro.txt",
            isFree: true,
          },
          {
            title: "Working with Outlook",
            duration: "10:15",
            videoUrl: "/courses/M365-1/outlook.mp4",
          },
          {
            title: "Collaborating in Teams",
            duration: "08:45",
            videoUrl: "/courses/M365-1/teams.mp4",
          },
          {
            title: "Managing Files with OneDrive",
            duration: "07:20",
            videoUrl: "/courses/M365-1/onedrive.mp4",
          },
          {
            title: "Introduction to SharePoint",
            duration: "09:10",
            videoUrl: "/courses/M365-1/sharepoint.mp4",
          },
        ],
      },
    },
  });

  console.log(`✅ Seeded course: ${m365.title}`);
}

main()
  .then(() => {
    console.log("🌿 Seeding completed!");
  })
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
