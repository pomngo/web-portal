import { Link } from "react-router-dom";
import { images } from "../../../constants/images";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-gradient-to-b from-white to-[#FFF9F5] text-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 lg:px-12">
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
            <div className="pt-2 text-xs text-secondary/60">
              <span>Experience Together • India</span>
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
                  href="https://new.flockngo.com"
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
                  href="https://www.linkedin.com/company/flockngo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary/80 hover:text-btn01 transition-colors flex items-center gap-1"
                >
                  <span>LinkedIn</span>
                  <span className="text-[10px] text-slate-400">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-slate-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary/60">
          <p>© {new Date().getFullYear()} FlocknGo. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Turn WhatsApp chaos into structured community experiences.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
