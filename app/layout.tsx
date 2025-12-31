import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FutbolAI Explorer | AI-Powered Football Intelligence',
  description: 'AI-powered football intelligence platform with real-time analysis, Wikipedia integration, and 2026 FIFA World Cup features',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen text-white`}>
        {/* Main Navigation - Based on original futbolai */}
        <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-xl">⚽</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    FutbolAI
                  </h1>
                  <p className="text-xs text-gray-400">AI-Powered Football Intelligence</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-gray-300 hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                  Home
                </a>
                <a href="/world-cup" className="text-gray-300 hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                  World Cup 2026
                </a>
                <a href="/players" className="text-gray-300 hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                  Player Stats
                </a>
                <a href="#" className="text-gray-300 hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                  Team Analysis
                </a>
                <a href="#" className="text-gray-300 hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                  Video Highlights
                </a>
              </div>

              {/* Live Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-red-600 to-pink-500 rounded-full animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-xs font-bold text-white">LIVE</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 bg-gray-900/50 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                © 2024-2025 FutbolAI Explorer. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Football highlights and videos are property of their respective owners.
                All trademarks and registered trademarks are the property of their respective owners.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                AI-powered analysis using GROQ + Wikipedia • Current 2024-2026 data
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Developed by A. Guillen
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}