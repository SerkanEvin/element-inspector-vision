
import React from 'react';
import { Card } from "@/components/ui/card";

const InstallationGuide = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">How to Install Element Inspector Vision Extension</h1>
      
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Method 1: Install from Chrome Web Store (Coming Soon)</h2>
          <p className="text-gray-700">This extension will be available in the Chrome Web Store soon.</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Method 2: Install as Developer (Current Method)</h2>
          
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <p className="font-medium">Download and unzip the extension</p>
              <p className="text-gray-700">If you don't have the files, clone or download them from the repository.</p>
            </li>
            
            <li>
              <p className="font-medium">Build the extension</p>
              <div className="bg-gray-100 p-3 rounded-md my-2">
                <code>npm run build</code>
              </div>
              <p className="text-gray-700">This will create a build folder with the compiled extension.</p>
            </li>
            
            <li>
              <p className="font-medium">Open Chrome Extensions page</p>
              <ul className="list-disc pl-6">
                <li>Open Chrome browser</li>
                <li>Go to <code className="bg-gray-100 px-1 rounded">chrome://extensions</code> in the address bar</li>
                <li>Turn on "Developer mode" using the toggle in the top-right corner</li>
              </ul>
            </li>
            
            <li>
              <p className="font-medium">Load the extension</p>
              <ul className="list-disc pl-6">
                <li>Click the "Load unpacked" button that appears after enabling Developer mode</li>
                <li>Browse to the <strong>build folder</strong> of your project and select it</li>
              </ul>
            </li>
            
            <li>
              <p className="font-medium">Pin the extension (optional)</p>
              <ul className="list-disc pl-6">
                <li>Click on the puzzle piece icon in Chrome's toolbar</li>
                <li>Find "Element Inspector Vision" and click the pin icon</li>
              </ul>
            </li>
          </ol>
        </div>
        
        <div className="pt-4 border-t">
          <h2 className="text-xl font-semibold mb-2">Using the Extension</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Navigate to any website</li>
            <li>Click the Element Inspector Vision icon in your extensions bar</li>
            <li>Click "Extract Elements" to scan the page</li>
            <li>View the results or download the JSON file</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default InstallationGuide;
