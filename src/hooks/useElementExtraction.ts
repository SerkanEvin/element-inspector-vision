
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useElementExtraction = () => {
  const [elementsData, setElementsData] = useState<any | null>(null);
  const [previousData, setPreviousData] = useState<any | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // Load previously stored data on component mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage) {
          chrome.storage.local.get(['elementsData'], (result) => {
            if (result.elementsData) {
              setPreviousData(result.elementsData);
            }
          });
        } else {
          console.log('Chrome storage API not available - running in development mode');
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };

    loadStoredData();
  }, []);

  const handleExtractElements = () => {
    setIsExtracting(true);

    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        // Chrome extension environment
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          
          if (activeTab?.id) {
            chrome.scripting.executeScript({
              target: { tabId: activeTab.id },
              files: ['contentScript.js']
            }, () => {
              if (chrome.runtime.lastError) {
                console.error('Error executing script:', chrome.runtime.lastError);
                toast({
                  title: 'Extraction Error',
                  description: 'Failed to execute element extraction script',
                  variant: 'destructive'
                });
                setIsExtracting(false);
                return;
              }

              // Listen for message from content script
              const messageListener = (message: any, sender: any) => {
                if (message.type === 'ELEMENTS_EXTRACTED') {
                  setElementsData(message.data);
                  
                  // Store current data for future comparison
                  if (chrome.storage) {
                    chrome.storage.local.set({ elementsData: message.data });
                  }
                  
                  // Save previous data
                  if (elementsData) {
                    setPreviousData(elementsData);
                  }
                  
                  setIsExtracting(false);
                  toast({
                    title: 'Extraction Complete',
                    description: `Extracted ${Object.values(message.data).flat().length} elements`,
                  });
                  
                  // Remove the listener
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              };
              
              chrome.runtime.onMessage.addListener(messageListener);
            });
          }
        });
      } else {
        // Development environment - mock data for testing
        console.log('Running in development mode - using mock data');
        setTimeout(() => {
          const mockData = {
            buttons: [{ 
              type: 'button', 
              text: 'Example Button', 
              xpath: '/html/body/div/button[1]',
              css_selector: 'button.primary',
              attributes: { id: 'btn-1', class: 'primary' } 
            }],
            forms: [{ 
              type: 'form', 
              xpath: '/html/body/div/form',
              css_selector: 'form#contact',
              attributes: { id: 'contact', method: 'post' } 
            }],
            inputs: []
          };
          setElementsData(mockData);
          setIsExtracting(false);
          toast({
            title: 'Development Mode',
            description: 'Using mock data for testing',
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error during extraction:', error);
      toast({
        title: 'Extraction Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      setIsExtracting(false);
    }
  };

  const handleDownloadJson = () => {
    if (!elementsData) return;
    
    const dataStr = JSON.stringify(elementsData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `page-elements-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    elementsData,
    previousData,
    isExtracting,
    handleExtractElements,
    handleDownloadJson
  };
};
