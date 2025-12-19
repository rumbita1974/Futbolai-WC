// pages/test-icons.tsx - Icon Size Test
export default function IconTest() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Icon Size Test</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold mb-2">Navigation Icons</h2>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-100 rounded flex items-center gap-2">
              <span className="icon-emoji icon-lg">??</span>
              <span>Fixtures</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 rounded flex items-center gap-2">
              <span className="icon-emoji icon-lg">??</span>
              <span>Teams</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 rounded flex items-center gap-2">
              <span className="icon-emoji icon-lg">???</span>
              <span>Venues</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold mb-2">Small Icons</h2>
          <div className="flex gap-4 items-center">
            <span className="icon-emoji icon-sm">??</span>
            <span>Location (small)</span>
            
            <span className="icon-emoji icon-sm">?</span>
            <span>Time (small)</span>
            
            <span className="icon-emoji icon-md">??</span>
            <span>Search (medium)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold mb-2">Arrows</h2>
          <div className="flex gap-4 items-center">
            <span className="icon-emoji icon-sm">?</span>
            <span>Up arrow</span>
            
            <span className="icon-emoji icon-sm">?</span>
            <span>Down arrow</span>
            
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span>SVG arrow (should be 16px)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
