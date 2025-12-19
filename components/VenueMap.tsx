// components/VenueMap.tsx - Simplified version
export default function VenueMap() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">World Cup 2026 Venues</h3>
      <p className="text-gray-600 mb-4">
        Interactive map coming soon. To enable: npm install leaflet@1.9.4 react-leaflet@4.2.1
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="font-bold">MetLife Stadium</div>
          <div className="text-sm text-gray-600">New York, USA</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="font-bold">Estadio Azteca</div>
          <div className="text-sm text-gray-600">Mexico City, Mexico</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="font-bold">SoFi Stadium</div>
          <div className="text-sm text-gray-600">Los Angeles, USA</div>
        </div>
      </div>
    </div>
  );
}
