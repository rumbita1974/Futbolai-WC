'use client';

import { useState } from 'react';

export default function ConvertSchedulePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/schedule/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'convert',
          source: '/data/FIFA-World-Cup-2026-schedule.txt'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Conversion failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDirectConvert = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Direct conversion using the service
      const response = await fetch('/api/schedule/convert');
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Conversion failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Convert Schedule Data</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Schedule Conversion Tool</h2>
        <p className="mb-6 text-gray-600">
          Convert your <code>FIFA-World-Cup-2026-schedule.txt</code> file to JSON format.
          Your file should be located at: <code>D:\FutbolAi\data\</code>
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleDirectConvert}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Converting...' : 'Convert TXT to JSON'}
          </button>
          
          <div className="text-sm text-gray-500">
            This will create: <code>schedule.json</code> in your data folder
          </div>
        </div>
      </div>
      
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-800 mb-2">✓ Conversion Successful!</h3>
          <pre className="bg-white p-4 rounded border overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
          <div className="mt-4">
            <a 
              href="/world-cup" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View World Cup Schedule →
            </a>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-red-800 mb-2">✗ Error</h3>
          <p className="text-red-700">{error}</p>
          <div className="mt-4 text-sm text-gray-600">
            <p>Make sure:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Your TXT file exists at <code>D:\FutbolAi\data\FIFA-World-Cup-2026-schedule.txt</code></li>
              <li>The file is not empty</li>
              <li>The format matches: "June 11 Germany vs Scotland at Munich 15:00"</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold mb-3">Manual Alternative:</h3>
        <p className="text-sm mb-3">If automatic conversion fails, you can manually check:</p>
        <ol className="list-decimal pl-5 text-sm space-y-2">
          <li>Open Command Prompt in <code>D:\FutbolAi\</code></li>
          <li>Check if file exists: <code>dir data\FIFA-World-Cup-2026-schedule.txt</code></li>
          <li>View first few lines: <code>type data\FIFA-World-Cup-2026-schedule.txt | head -5</code></li>
        </ol>
      </div>
    </div>
  );
}