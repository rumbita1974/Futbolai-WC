import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-2">⚽</span>
              FutbolAI WC 2026
            </h3>
            <p className="text-gray-400">
              Official fan site for FIFA World Cup 2026.
              Schedule, stats, and real-time updates.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/world-cup" className="text-gray-400 hover:text-white transition-colors">
                  World Cup Schedule
                </Link>
              </li>
              <li>
                <Link href="/groups" className="text-gray-400 hover:text-white transition-colors">
                  Group Standings
                </Link>
              </li>
              <li>
                <Link href="/venues" className="text-gray-400 hover:text-white transition-colors">
                  Stadiums & Venues
                </Link>
              </li>
              <li>
                <Link href="/teams" className="text-gray-400 hover:text-white transition-colors">
                  Teams & Rosters
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.fifa.com/tournaments/mens/worldcup/2026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Official FIFA Website
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/2026_FIFA_World_Cup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Wikipedia
                </a>
              </li>
              <li>
                <a
                  href="/api/schedule/convert"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Data Source
                </a>
              </li>
              <li>
                <Link href="/api" className="text-gray-400 hover:text-white transition-colors">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact/Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4">
              Get match reminders and tournament updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-3 py-2 text-gray-900 rounded-l focus:outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} FutbolAI WC 2026. This is a fan site and is not affiliated with FIFA.
            All data is for informational purposes only.
          </p>
          <p className="mt-2 text-sm">
            Schedule data parsed from official FIFA World Cup 2026 schedule.
            Team flags provided by FlagCDN.
          </p>
        </div>
      </div>
    </footer>
  );
}
