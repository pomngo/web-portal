import { Link } from "react-router-dom";
import { images } from "../../../constants/images";

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/flockngo_/?hl=en",
    ariaLabel: "Follow FlocknGo on Instagram",
    hoverClasses: "hover:border-[#E1306C] hover:text-[#E1306C] hover:bg-[#FFF0F5] hover:shadow-pink-100",
    icon: (
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@flockngo5875",
    ariaLabel: "Subscribe to FlocknGo on YouTube",
    hoverClasses: "hover:border-[#FF0000] hover:text-[#FF0000] hover:bg-[#FFF5F5] hover:shadow-red-100",
    icon: (
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/flockngo/posts/?viewAsMember=true",
    ariaLabel: "Connect with FlocknGo on LinkedIn",
    hoverClasses: "hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-[#F0F7FF] hover:shadow-blue-100",
    icon: (
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 0 0 0-2.92 1.46 1.46 0 0 0 0 2.92m1.37 9.74v-8.37H5.09v8.37h2.74z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/CoorgSupport",
    ariaLabel: "Follow FlocknGo on X (Twitter)",
    hoverClasses: "hover:border-black hover:text-black hover:bg-slate-100 hover:shadow-slate-300",
    icon: (
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61553214360956&sk=directory_contact_info",
    ariaLabel: "Follow FlocknGo on Facebook",
    hoverClasses: "hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#F0F6FF] hover:shadow-blue-100",
    icon: (
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-gradient-to-b from-white to-[#FFF9F5] text-secondary">
      <div className="w-full px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={images.logo}
                alt="FlocknGo Events - Discover Local Activities & Events"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-xs sm:text-sm text-secondary/80 leading-relaxed">
              FlocknGo is an event and community discovery platform connecting people with local clubs, workshops, and social gatherings across India.
            </p>
            <div className="text-xs text-secondary/60">
              <span>Experience Together • India</span>
            </div>

            {/* Social Media Links with Rich Hover Animation */}
            <div className="pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-primary-dark mb-3">
                Follow Us
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                {SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.ariaLabel}
                    className={`group relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-md active:scale-95 ${item.hoverClasses}`}
                  >
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>

                    {/* Micro-Tooltip on Hover */}
                    <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 shadow-sm transition-all duration-200 group-hover:-top-9 group-hover:opacity-100 z-20">
                      {item.name}
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Discover Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary-dark">
              Discover
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/activities" className="text-secondary/80 hover:text-btn01 transition-colors">
                  Activities & Events
                </Link>
              </li>
              <li>
                <Link to="/flocks" className="text-secondary/80 hover:text-btn01 transition-colors">
                  Community Flocks
                </Link>
              </li>
              <li>
                <Link to="/activities/nearby-activities" className="text-secondary/80 hover:text-btn01 transition-colors">
                  Nearby Activities
                </Link>
              </li>
              <li>
                <Link to="/flocks/community-flocks" className="text-secondary/80 hover:text-btn01 transition-colors">
                  Explore Communities
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured City Hubs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary-dark">
              City Hubs
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/flocks/location/pune" className="text-secondary/80 hover:text-btn01 transition-colors">
                  Communities in Pune
                </Link>
              </li>
              <li>
                <Link to="/activities/location/mumbai" className="text-secondary/80 hover:text-btn01 transition-colors">
                  Activities in Mumbai
                </Link>
              </li>
              <li>
                <span className="text-secondary/50 text-[11px] block pt-1">
                  More cities: Bangalore, Delhi NCR (coming soon)
                </span>
              </li>
            </ul>
          </div>

          {/* For Organizers & Brand */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary-dark">
              For Organizers
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="https://flockngo-story.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary/80 hover:text-btn01 transition-colors flex items-center gap-1"
                >
                  <span>About FlocknGo</span>
                  <span className="text-[10px] text-slate-400">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://new.flockngo.com/#how-it-works"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary/80 hover:text-btn01 transition-colors flex items-center gap-1"
                >
                  <span>How It Works</span>
                  <span className="text-[10px] text-slate-400">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://web.flockngo.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary/80 hover:text-btn01 transition-colors flex items-center gap-1"
                >
                  <span>Organizer Workspace</span>
                  <span className="text-[10px] text-slate-400">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/flockngo/posts/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary/80 hover:text-btn01 transition-colors flex items-center gap-1"
                >
                  <span>LinkedIn Page</span>
                  <span className="text-[10px] text-slate-400">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-slate-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary/60">
          <p>© {new Date().getFullYear()} FlocknGo. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={`footer-bottom-${item.name}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel}
                className={`transition-colors duration-200 hover:text-btn01`}
                title={item.name}
              >
                {item.name}
              </a>
            ))}
          </div>
          <p className="text-center sm:text-right">
            Turn WhatsApp chaos into structured community experiences.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
