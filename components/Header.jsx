import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-white text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">
              ⚽
            </div>
            <div>
              <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
                FutbolAI WC 2026
              </Link>
              <p className="text-sm text-blue-200">FIFA World Cup Schedule</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-6">
            <Link
              href="/world-cup"
              className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
            >
              World Cup Schedule
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Live Status */}
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Updates</span>
          </div>
        </div>
      </div>

      {/* Sub-header */}
      <div className="bg-blue-800 py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center">
              <i className="fas fa-calendar-alt mr-2"></i>
              June 11 - July 19, 2026
            </span>
            <span className="flex items-center">
              <i className="fas fa-map-marker-alt mr-2"></i>
              16 Host Cities
            </span>
            <span className="flex items-center">
              <i className="fas fa-users mr-2"></i>
              48 Teams
            </span>
            <span className="flex items-center">
              <i className="fas fa-futbol mr-2"></i>
              104 Matches
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}