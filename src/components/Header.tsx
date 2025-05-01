
import { useState, useEffect } from 'react';

const Header = () => {
  const [url, setUrl] = useState<string>('');
  
  useEffect(() => {
    // Check if we're in a Chrome extension environment
    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          setUrl(tabs[0].url);
        }
      });
    } else {
      // For development outside Chrome extension
      setUrl('https://example.com');
    }
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-6 h-6 text-blue-600"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Element Inspector Vision
            </h1>
          </div>
          
          {url && (
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
              {new URL(url).hostname}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
