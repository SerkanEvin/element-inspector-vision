
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
    // Check if we're in a Chrome extension environment
    const isExtension = !!(window as any).chrome?.runtime?.id;
    
    if (isExtension) {
      // Load any previously stored data
      (window as any).chrome.storage.local.get(['previousElementsData'], (result: any) => {
        if (result.previousElementsData) {
          setPreviousData(result.previousElementsData);
        }
      });
    }
  }, []);

  const handleExtractElements = async () => {
    setIsExtracting(true);
    
    // Check if we're in a Chrome extension environment
    if ((window as any).chrome?.tabs) {
      try {
        // Get current active tab
        const [tab] = await new Promise<chrome.tabs.Tab[]>((resolve) => {
          (window as any).chrome.tabs.query({ active: true, currentWindow: true }, resolve);
        });
        
        if (tab.id) {
          // Execute content script to extract elements
          (window as any).chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: extractPageElements
          }, (results: any) => {
            if (results && results[0]?.result) {
              const extractedData = results[0].result;
              setElementsData(extractedData);
              
              // Store this data for future comparisons
              (window as any).chrome.storage.local.set({ 'previousElementsData': extractedData });
            }
            setIsExtracting(false);
          });
        }
      } catch (error) {
        console.error("Error extracting elements:", error);
        setIsExtracting(false);
      }
    } else {
      // For development outside Chrome extension
      // Mock data for testing
      const mockData = {
        buttons: [
          {
            type: "button",
            text: "Submit",
            xpath: "/html/body/div/button[1]",
            css_selector: "button#submit-btn",
            attributes: {
              id: "submit-btn",
              class: "btn primary",
              type: "submit"
            }
          }
        ],
        forms: [],
        inputs: []
      };
      
      setTimeout(() => {
        setElementsData(mockData);
        setIsExtracting(false);
      }, 1000);
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
