import fs from "fs";
import path from "path";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  textUrl?: string;
  isFree: boolean; // ✅ added new field
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
  topics?: string[];
}

const coursesDir = path.join(process.cwd(), "courses");

export const courses: Course[] = [
 
   // ✅ COURSE 1 - MICROSOFT 365 ADMINISTRATION
   {
    id: "1",
    slug: "M365-1",
    title: "Microsoft 365 Administration – Part 1",
    description:
      "Enhance your Microsoft 365 Administration skills with practical, hands-on lessons.",
    topics: [
      "Microsoft 365 overview",
      "Setting up your tenant",
      "User and license management",
      "Security & compliance basics",
      "Automation with PowerShell",
    ],
    lessons: [
      {
        id: "l1",
        title: "1. Understanding Microsoft 365 Tenant",
        duration: "01:41",
        videoUrl: "/courses/M365-1/Understanding Microsoft 365 Tenant.mp4",
        isFree: true, // ✅ free lesson
      },
      {
        id: "l2",
        title: "2. Setting up User Access",
        duration: "03:15",
        textUrl: "/courses/M365-1/text/security-overview.html",
        videoUrl: "/courses/M365-1/Understanding Microsoft 365 Tenant.mp4",
        isFree: false, // 🔒 locked
      },
      {
        id: "l3",
        title: "3. Managing Licenses and Groups",
        duration: "04:10",
        videoUrl: "/api/videos/M365-1/Licenses-3.mp4",
        isFree: false, // 🔒 locked
      },
    ],
  },

  // ✅ COURSE 2 - MASTER OBSIDIAN
  {
    id: "2",
    slug: "Obsidian",
    title: "Master Obsidian - Beyond just note taking",
    description:
      "An exclusive hands-on lab to build a modern workspace without missing out things which are most important.",
    topics: [
      "Setting up Obsidian vault",
      "Adding useful community plug-ins",
    ],
    lessons: [
      {
        id: "l1",
        title: "1. Setting up Obsidian vault",
        duration: "02:30",
        videoUrl: "/courses/Obsidian/obsidian-1.mp4",
        isFree: true, // ✅ free lesson
      },
      {
        id: "l2",
        title: "2. Adding useful community plug-ins",
        duration: "04:05",
        videoUrl: "/courses/Obsidian/obsidian-2.mp4",
        isFree: false, // 🔒 locked
      },
    ],
  },
];

