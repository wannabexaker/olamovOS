export type Project = {
  accent: string;
  appId: string;
  description: string;
  embeddable: boolean;
  icon: string;
  name: string;
  tags: string[];
  url: string;
};

// Single source of truth for the "My Projects" showcase and the ExternalApp
// windows it launches. `appId` matches the process id registered in
// contexts/process/directory.ts, so ExternalApp resolves its URL from here.
export const PROJECTS: Project[] = [
  {
    accent: "#cc00ff",
    appId: "Radevu",
    description:
      "Appointment-booking SaaS for small service businesses — online booking, customers and reminders.",
    embeddable: true,
    icon: "/System/Icons/olamov-radevu.png",
    name: "Radevu",
    tags: ["SaaS", "Booking", "Next.js"],
    url: "https://radevu.olamov.com/",
  },
  {
    accent: "#f7b500",
    appId: "EyeInTheSky",
    description:
      "Cluster-pays slot game built with PixiJS — a temple/ritual theme with cascading wins.",
    embeddable: true,
    icon: "/System/Icons/olamov-eye.png",
    name: "The Eye in the Sky",
    tags: ["Game", "PixiJS", "Slot"],
    url: "https://eye.olamov.com/",
  },
  {
    accent: "#ff2d95",
    appId: "VCHub",
    description:
      "GTA VI price, stats and value-for-money database for Vice City — everything worth buying.",
    embeddable: true,
    icon: "/System/Icons/olamov-vchub.png",
    name: "VC Hub",
    tags: ["Data", "GTA VI", "Next.js"],
    url: "https://vchub.olamov.com/",
  },
  {
    accent: "#b59cdc",
    appId: "Cypher",
    description:
      "Rap & hip-hop battle platform — host rooms, submit tracks and let the crowd vote live.",
    embeddable: true,
    icon: "/System/Icons/olamov-cypher.png",
    name: "Cypher",
    tags: ["Music", "Real-time", "Next.js"],
    url: "https://cypher.olamov.com/",
  },
  {
    accent: "#7c5cff",
    appId: "FitSentry",
    description:
      "Fully offline Android fitness & nutrition coach — runs on the phone alone, with no account, no server and no network.",
    embeddable: false,
    icon: "/System/Icons/olamov-fitsentry.png",
    name: "Fit Sentry",
    tags: ["Android", "Google Play"],
    url: "https://play.google.com/store/apps/details?id=com.fitsentry.app",
  },
  // Accent and icon below are neutral placeholders until they get their own.
  {
    accent: "#8a8a8a",
    appId: "NetSentry",
    description:
      "Home-network guard on a Raspberry Pi: watches a MikroTik router and Pi-hole, and alerts and acts from Telegram.",
    embeddable: false,
    icon: "/System/Icons/olamov-unknown.png",
    name: "NetSentry",
    tags: ["Raspberry Pi", "Telegram", "Self-hosted"],
    url: "https://github.com/wannabexaker/NetSentry",
  },
  {
    accent: "#8a8a8a",
    appId: "HIDwayPlus",
    description:
      "Hardware remote keyboard and mouse: a Windows client drives a Pi relay and a Pico that is a real USB device, so it works at the login screen and in the BIOS.",
    embeddable: false,
    icon: "/System/Icons/olamov-unknown.png",
    name: "HIDway+",
    tags: ["Hardware", "USB HID", "Raspberry Pi"],
    url: "https://github.com/wannabexaker/HIDway-Plus",
  },
  {
    accent: "#8a8a8a",
    appId: "PMD",
    description:
      "Project-management app: Spring Boot + MongoDB API with a React frontend.",
    embeddable: false,
    icon: "/System/Icons/olamov-unknown.png",
    name: "PMD",
    tags: ["Spring Boot", "MongoDB", "Dormant"],
    url: "https://pmd.olamov.com/",
  },
];

export const getProjectByAppId = (appId: string): Project | undefined =>
  PROJECTS.find((project) => project.appId === appId);
