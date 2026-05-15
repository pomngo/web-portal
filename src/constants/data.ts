import CompassIcon from "../components/icons/CompassIcon";
import HomeIcon from "../components/icons/HomeIcon";
import UsersIcon from "../components/icons/UsersIcon";
import { Icons } from "./icons";
import type { CardType } from "../types";


export const filterOptions = [
  {
    icon: Icons.users,
    label: "Adventure",
  },
  {
    icon: Icons.watch,
    label: "Social",
  },
  {
    icon: Icons.heart,
    label: "Creative",
  },
  {
    icon: Icons.mapPinned,
    label: "Tech",
  },
  {
    icon: Icons.flag,
    label: "Wellness",
  },
  {
    icon: Icons.utensils,
    label: "Culinary",
  },
  {
    icon: Icons.calendar,
    label: "History",
  },
  {
    icon: Icons.music,
    label: "Music",
  },
  {
    icon: Icons.camera,
    label: "Photography",
  },
  {
    icon: Icons.plane,
    label: "Travel",
  },
  {
    icon: Icons.dumbbell,
    label: "Fitness",
  },
  {
    icon: Icons.gamepad,
    label: "Gaming",
  },
  {
    icon: Icons.film,
    label: "Movies",
  },
  {
    icon: Icons.trees,
    label: "Nature",
  },
];


export const navItems = [
  {
    name: "Home",
    path: "/",
    matchPaths: ["/"],
    icon: HomeIcon,
  },
  {
    name: "Flocks",
    path: "/flocks",
    matchPaths: ["/flock"],
    icon: CompassIcon,
  },
  {
    name: "Activities",
    path: "/activities",
    matchPaths: ["/activities"],
    icon: UsersIcon,
  },
];

export const nearbyActivities = [
  {
    id: 1,
    title: "Rangoli Art Walk",
    location: "Balewadi, Pune",
    membersGoing: 245,
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
    buttonText: "Join Now",
  },
  {
    id: 2,
    title: "Monsoon Feast in the Park",
    location: "Baner, Pune",
    membersGoing: 180,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    buttonText: "Join Now",
  },
  {
    id: 3,
    title: "Ganges Sunrise Jog",
    location: "Akurdi, Pune",
    membersGoing: 320,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    buttonText: "Join Now",
  },
  {
    id: 4,
    title: "Desi Board Game Fest",
    location: "Aundh, Pune",
    membersGoing: 150,
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
    buttonText: "Join Now",
  },
  {
    id: 5,
    title: "Sunset Paddle Adventure",
    location: "Karve Nagar, Pune",
    membersGoing: 275,
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322",
    buttonText: "Join Now",
  },
  {
    id: 6,
    title: "Street Food Carnival",
    location: "FC Road, Pune",
    membersGoing: 410,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    buttonText: "Join Now",
  },
  {
    id: 7,
    title: "Morning Yoga Retreat",
    location: "Kothrud, Pune",
    membersGoing: 130,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    buttonText: "Join Now",
  },
  {
    id: 8,
    title: "Photography Walk",
    location: "Shivaji Nagar, Pune",
    membersGoing: 220,
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
    buttonText: "Join Now",
  },
  {
    id: 9,
    title: "Live Music Evening",
    location: "Hinjewadi, Pune",
    membersGoing: 365,
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    buttonText: "Join Now",
  },
  {
    id: 10,
    title: "Cycling Adventure Club",
    location: "Wakad, Pune",
    membersGoing: 290,
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    buttonText: "Join Now",
  },
];

export const communityFlocks: { id: number; title: string; description: string; image: string; type: CardType; }[] = [
  {
    id: 1,
    title: "Road Trip Organizers",
    description: "Weekend highway rides with riders community.",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop",
    type: "large",
  },
  {
    id: 2,
    title: "Adventure Hub Rides",
    description: "Trail rides and outdoor escapes.",
    image:
      "https://t4.ftcdn.net/jpg/05/33/18/63/360_F_533186395_mgIICMga0cV6aSI4Do9E7KWOcPMRnQUl.jpg",
    type: "small",
  },
  {
    id: 3,
    title: "Kings Royal Enfield",
    description: "Classic rides and strong bonding.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    type: "small",
  },
  {
    id: 4,
    title: "Urban Riders",
    description: "Night rides and cafe hops.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    type: "tall",
  },
  {
    id: 5,
    title: "Engineers on Wheels",
    description: "Tech minds who ride together.",
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=1200&auto=format&fit=crop",
    type: "wide",
  },
];


export const exploreActivities = [
  {
    id: 1,
    title: "Acoustic Open Mic Night",
    location: "Pune",
    members: 300,
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81"
  },
  {
    id: 2,
    title: "River Yoga",
    location: "Mumbai",
    members: 1000,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773"
  },
  {
    id: 3,
    title: "Live Music Jam",
    location: "Mumbai",
    members: 100,
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35"
  },
  {
    id: 4,
    title: "Food Experiences",
    location: "Pune",
    members: 1304,
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3"
  },
  {
    id: 5,
    title: "Startup Networking",
    location: "Bangalore",
    members: 850,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
  },
  {
    id: 6,
    title: "Photography Walk",
    location: "Delhi",
    members: 420,
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4"
  },
  {
    id: 7,
    title: "Weekend Trek",
    location: "Manali",
    members: 670,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    id: 8,
    title: "Art & Craft Meetup",
    location: "Jaipur",
    members: 215,
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f"
  },
  {
    id: 9,
    title: "Tech Hackathon",
    location: "Hyderabad",
    members: 1400,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
  },
  {
    id: 10,
    title: "Beach Volleyball",
    location: "Goa",
    members: 510,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  }
];

export const flockDetail = {
  id: 1,
  name: "Road Trip Organizers",
  description:
    "We plan unique bike rides, highway adventures, weekend tours, and community meetups for passionate riders.",

  coverImage:
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1600&auto=format&fit=crop",

  profileImage:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",

  category: "Motorcycle Community",

  location: "Pune, Maharashtra",

  membersCount: 234,
  totalActivities: 18,

  createdBy: {
    id: 1,
    name: "Akash Shukla",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  },

  socialLinks: {
    instagram: "https://instagram.com/flockgo",
    whatsapp: "https://chat.whatsapp.com/example",
  },

  tags: ["Adventure", "Bike Rides", "Road Trips"],

  createdAt: "2026-01-10",
};

export const flockActivities = [
  {
    id: 1,
    flockId: 1,

    title: "Diwali Ride Meetup",

    description:
      "Celebrate Diwali with a night ride and rider community gathering.",

    coverImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",

    location: "Lonavala, Pune",

    startDate: "2026-04-03T07:00:00",
    endDate: "2026-04-03T21:00:00",

    status: "draft",

    attendees: 54,

    reminders: 12,

    category: "Ride",

    tags: ["Festival", "Night Ride"],
  },

  {
    id: 2,
    flockId: 1,

    title: "Monsoon Highway Ride",

    description:
      "Long scenic ride through mountain roads during monsoon season.",

    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",

    location: "Mulshi, Pune",

    startDate: "2026-04-07T06:00:00",
    endDate: "2026-04-07T18:00:00",

    status: "scheduled",

    attendees: 248,

    reminders: 38,

    category: "Adventure",

    tags: ["Adventure", "Highway"],
  },

  {
    id: 3,
    flockId: 1,

    title: "Royal Enfield Breakfast Ride",

    description:
      "Early morning breakfast ride with Royal Enfield enthusiasts.",

    coverImage:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=1200&auto=format&fit=crop",

    location: "Lavasa Road, Pune",

    startDate: "2026-04-11T05:30:00",
    endDate: "2026-04-11T11:00:00",

    status: "scheduled",

    attendees: 180,

    reminders: 21,

    category: "Meetup",

    tags: ["Breakfast Ride", "Weekend"],
  },

  {
    id: 4,
    flockId: 1,

    title: "Sunset Coastal Ride",

    description:
      "Weekend coastal highway ride with sunset photography stops.",

    coverImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop",

    location: "Alibaug, Maharashtra",

    startDate: "2026-04-15T08:00:00",
    endDate: "2026-04-15T22:00:00",

    status: "live",

    attendees: 312,

    reminders: 44,

    category: "Photography",

    tags: ["Photography", "Coastal"],
  },

  {
    id: 5,
    flockId: 1,

    title: "Night City Ride",

    description:
      "Late-night city ride with food stops and rider networking.",

    coverImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",

    location: "Pune City",

    startDate: "2026-04-20T21:00:00",
    endDate: "2026-04-21T02:00:00",

    status: "completed",

    attendees: 143,

    reminders: 17,

    category: "Community",

    tags: ["Night Ride", "Community"],
  },

  {
    id: 6,
    flockId: 1,

    title: "Weekend Camping Adventure",

    description:
      "Camping under the stars with bike riders and outdoor activities.",

    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",

    location: "Pawna Lake",

    startDate: "2026-04-25T09:00:00",
    endDate: "2026-04-26T14:00:00",

    status: "scheduled",

    attendees: 280,

    reminders: 52,

    category: "Camping",

    tags: ["Camping", "Adventure"],
  },

  {
    id: 7,
    flockId: 1,

    title: "Street Food Ride",

    description:
      "Ride through the city exploring Pune’s best street food spots.",

    coverImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",

    location: "FC Road, Pune",

    startDate: "2026-05-02T18:00:00",
    endDate: "2026-05-02T23:00:00",

    status: "live",

    attendees: 410,

    reminders: 63,

    category: "Food",

    tags: ["Food", "Night Out"],
  },

  {
    id: 8,
    flockId: 1,

    title: "Morning Yoga Ride",

    description:
      "Start your morning with yoga, meditation, and a short ride.",

    coverImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",

    location: "Kothrud, Pune",

    startDate: "2026-05-08T06:00:00",
    endDate: "2026-05-08T10:00:00",

    status: "scheduled",

    attendees: 132,

    reminders: 18,

    category: "Wellness",

    tags: ["Yoga", "Morning"],
  },

  {
    id: 9,
    flockId: 1,

    title: "Photography Ride Tour",

    description:
      "Capture beautiful landscapes while riding through scenic routes.",

    coverImage:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",

    location: "Sinhagad Fort",

    startDate: "2026-05-14T07:00:00",
    endDate: "2026-05-14T19:00:00",

    status: "draft",

    attendees: 221,

    reminders: 26,

    category: "Photography",

    tags: ["Photography", "Nature"],
  },

  {
    id: 10,
    flockId: 1,

    title: "Bike Maintenance Workshop",

    description:
      "Learn basic bike maintenance and long-ride preparation tips.",

    coverImage:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",

    location: "Wakad, Pune",

    startDate: "2026-05-21T11:00:00",
    endDate: "2026-05-21T16:00:00",

    status: "scheduled",

    attendees: 94,

    reminders: 14,

    category: "Workshop",

    tags: ["Workshop", "Learning"],
  },
];