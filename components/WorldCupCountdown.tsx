'use client';

import { useState, useEffect } from 'react';

export default function WorldCupCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const worldCupStartDate = new Date('2026-06-11T00:00:00Z');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = worldCupStartDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-gray-700 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-lg font-semibold text-green-400">COUNTDOWN TO WORLD CUP 2026</span>
        </div>
        <span className="text-sm text-gray-400">June 11, 2026</span>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-white">{timeLeft.days.toString().padStart(2, '0')}</div>
          <div className="text-xs md:text-sm font-medium text-gray-200 mt-1">DAYS</div>
        </div>
        <div className="bg-gradient-to-b from-green-600 to-green-700 rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-xs md:text-sm font-medium text-gray-200 mt-1">HOURS</div>
        </div>
        <div className="bg-gradient-to-b from-yellow-600 to-yellow-700 rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs md:text-sm font-medium text-gray-200 mt-1">MINUTES</div>
        </div>
        <div className="bg-gradient-to-b from-red-600 to-red-700 rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs md:text-sm font-medium text-gray-200 mt-1">SECONDS</div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-400">
          {timeLeft.days > 365 ? 'Over a year to go!' : 
           timeLeft.days > 30 ? 'Getting closer!' : 
           timeLeft.days > 7 ? 'Almost here!' : 
           'Starts this week!'}
        </div>
      </div>
    </div>
  );
}