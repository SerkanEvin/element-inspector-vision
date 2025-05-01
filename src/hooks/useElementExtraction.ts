
import { useState, useEffect } from 'react';
import { extractPageElements } from '@/utils/elementExtractor';

interface ElementsData {
  buttons: any[];
  forms: any[];
  inputs: any[];
  selects?: any[];
  links?: any[];
  others?: any[];
}

export const useElementExtraction = () => {
  const [elementsData, setElementsData] = useState<ElementsData | null>(null);
  const [previousData, setPreviousData] = useState<ElementsData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    // Load any previously stored data when the popup opens
    chrome.storage.local.get(['previousElementsData'], (result) => {
      if (result.previousElementsData) {
        setPreviousData(result.previousElementsData);
      }
    });
  }, []);

  const handleExtractElements = async () => {
    setIsExtracting(true);
    
    try {
      // Get current active tab
      const [tab] = await new Promise<chrome.tabs.Tab[]>((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, resolve);
      });
      
      if (tab.id) {
        // Execute content script to extract elements
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: extractPageElements
        }, (results) => {
          if (results && results[0]?.result) {
            const extractedData = results[0].result;
            setElementsData(extractedData);
            
            // Store this data for future comparisons
            chrome.storage.local.set({ 'previousElementsData': extractedData });
          }
          setIsExtracting(false);
        });
      }
    } catch (error) {
      console.error("Error extracting elements:", error);
      setIsExtracting(false);
    }
  };

  const handleDownloadJson = () => {
    if (!elementsData) return;
    
    const dataStr = JSON.stringify(elementsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'element-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { 
    elementsData, 
    previousData, 
    isExtracting, 
    handleExtractElements, 
    handleDownloadJson 
  };
};
