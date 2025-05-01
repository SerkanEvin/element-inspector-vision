
import { useEffect, useState } from 'react';
import ElementExtractor from '@/components/ElementExtractor';
import ElementComparison from '@/components/ElementComparison';
import ElementList from '@/components/ElementList';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [elementsData, setElementsData] = useState<any>(null);
  const [previousData, setPreviousData] = useState<any>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeTab, setActiveTab] = useState("extract");

  useEffect(() => {
    // Check if we're in a Chrome extension environment
    const isExtension = !!chrome?.runtime?.id;
    
    if (isExtension) {
      // Load any previously stored data
      chrome.storage.local.get(['previousElementsData'], (result) => {
        if (result.previousElementsData) {
          setPreviousData(result.previousElementsData);
        }
      });
    }
  }, []);

  const handleExtractElements = async () => {
    setIsExtracting(true);
    
    // Check if we're in a Chrome extension environment
    if (chrome?.tabs) {
      try {
        // Get current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-8">
            <TabsTrigger value="extract">Extract Elements</TabsTrigger>
            <TabsTrigger value="compare">Compare Changes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="extract" className="space-y-6">
            <ElementExtractor 
              onExtract={handleExtractElements} 
              isExtracting={isExtracting}
            />
            
            {elementsData && (
              <div className="space-y-6">
                <ElementList elementsData={elementsData} />
                
                <div className="flex justify-end">
                  <Button onClick={handleDownloadJson} className="bg-blue-600 hover:bg-blue-700">
                    Download JSON
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="compare" className="space-y-6">
            <ElementComparison 
              currentData={elementsData} 
              previousData={previousData} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Function that will be injected into the page to extract elements
function extractPageElements() {
  const getXPath = (element) => {
    if (!element) return null;
    
    // Special case for document
    if (element === document) return '/';
    
    // Special case for html element
    if (element === document.documentElement) return '/html';
    
    let path = '';
    let currentElement = element;
    
    while (currentElement !== document.documentElement) {
      let index = 1;
      let sibling = currentElement.previousSibling;
      
      while (sibling) {
        if (sibling.nodeType === 1 && sibling.nodeName === currentElement.nodeName) {
          index++;
        }
        sibling = sibling.previousSibling;
      }
      
      const tagName = currentElement.nodeName.toLowerCase();
      path = `/${tagName}[${index}]${path}`;
      
      currentElement = currentElement.parentNode;
    }
    
    return `/html${path}`;
  };
  
  const getCssSelector = (element) => {
    if (!element || element === document || element === document.documentElement) {
      return 'html';
    }
    
    let selector = '';
    
    // Try ID first as it's most specific
    if (element.id) {
      return `#${element.id}`;
    }
    
    // Try with classes
    if (element.className && typeof element.className === 'string') {
      const classes = element.className.trim().split(/\s+/);
      if (classes.length > 0) {
        selector = element.nodeName.toLowerCase() + '.' + classes.join('.');
        
        // Check if this selector is unique
        if (document.querySelectorAll(selector).length === 1) {
          return selector;
        }
      }
    }
    
    // Try with tag name and attributes
    if (element.nodeName) {
      selector = element.nodeName.toLowerCase();
      
      if (element.name) {
        selector += `[name="${element.name}"]`;
      } else if (element.getAttribute('type')) {
        selector += `[type="${element.getAttribute('type')}"]`;
      }
      
      // Check if unique
      if (document.querySelectorAll(selector).length === 1) {
        return selector;
      }
    }
    
    // If not unique, add parent context
    if (element.parentNode && element.parentNode !== document && element.parentNode !== document.documentElement) {
      return `${getCssSelector(element.parentNode)} > ${selector || element.nodeName.toLowerCase()}`;
    }
    
    return selector || element.nodeName.toLowerCase();
  };
  
  const getAttributes = (element) => {
    const attributes = {};
    
    if (!element.attributes) return attributes;
    
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attributes[attr.name] = attr.value;
    }
    
    return attributes;
  };
  
  const extractElements = () => {
    const result = {
      buttons: [],
      forms: [],
      inputs: [],
      selects: [],
      links: [],
      others: []
    };
    
    // Extract buttons
    const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"]');
    buttons.forEach(button => {
      result.buttons.push({
        type: "button",
        text: button.textContent?.trim() || button.value || "",
        xpath: getXPath(button),
        css_selector: getCssSelector(button),
        attributes: getAttributes(button)
      });
    });
    
    // Extract forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      result.forms.push({
        type: "form",
        xpath: getXPath(form),
        css_selector: getCssSelector(form),
        attributes: getAttributes(form)
      });
    });
    
    // Extract inputs
    const inputs = document.querySelectorAll('input:not([type="button"]):not([type="submit"]), textarea');
    inputs.forEach(input => {
      result.inputs.push({
        type: "input",
        name: input.name || "",
        xpath: getXPath(input),
        css_selector: getCssSelector(input),
        attributes: getAttributes(input)
      });
    });
    
    // Extract selects
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      result.selects.push({
        type: "select",
        name: select.name || "",
        xpath: getXPath(select),
        css_selector: getCssSelector(select),
        attributes: getAttributes(select),
        options: Array.from(select.options).map(option => ({
          value: option.value,
          text: option.text,
          selected: option.selected
        }))
      });
    });
    
    // Extract links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      result.links.push({
        type: "link",
        text: link.textContent?.trim() || "",
        href: link.href || "",
        xpath: getXPath(link),
        css_selector: getCssSelector(link),
        attributes: getAttributes(link)
      });
    });
    
    return result;
  };
  
  return extractElements();
}

export default Index;
