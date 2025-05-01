
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ElementComparisonProps {
  currentData: any;
  previousData: any;
}

const ElementComparison = ({ currentData, previousData }: ElementComparisonProps) => {
  const [differences, setDifferences] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  useEffect(() => {
    if (currentData && previousData) {
      const diffs = findDifferences(currentData, previousData);
      setDifferences(diffs);
    }
  }, [currentData, previousData]);
  
  const findDifferences = (current: any, previous: any) => {
    const allDiffs: any[] = [];
    
    // Define categories to compare
    const categories = ['buttons', 'forms', 'inputs', 'selects', 'links', 'others'];
    
    categories.forEach(category => {
      const currentElements = current[category] || [];
      const previousElements = previous[category] || [];
      
      // Find elements that exist in both, but have changed
      currentElements.forEach((currentElem: any) => {
        const matchingPrevElement = previousElements.find((prevElem: any) => {
          // Try to match elements based on some unique characteristics
          return (
            (prevElem.xpath === currentElem.xpath) ||
            (prevElem.css_selector === currentElem.css_selector) ||
            (prevElem.attributes?.id && prevElem.attributes.id === currentElem.attributes?.id)
          );
        });
        
        if (matchingPrevElement) {
          // Check for differences
          const elemDiffs = {
            type: category,
            element: currentElem,
            changes: []
          };
          
          // Compare XPath
          if (matchingPrevElement.xpath !== currentElem.xpath) {
            elemDiffs.changes.push({
              attribute: 'xpath',
              previous: matchingPrevElement.xpath,
              current: currentElem.xpath
            });
          }
          
          // Compare CSS selector
          if (matchingPrevElement.css_selector !== currentElem.css_selector) {
            elemDiffs.changes.push({
              attribute: 'css_selector',
              previous: matchingPrevElement.css_selector,
              current: currentElem.css_selector
            });
          }
          
          // Compare attributes
          const allAttributeKeys = new Set([
            ...Object.keys(matchingPrevElement.attributes || {}),
            ...Object.keys(currentElem.attributes || {})
          ]);
          
          allAttributeKeys.forEach((key) => {
            const prevValue = matchingPrevElement.attributes?.[key];
            const currValue = currentElem.attributes?.[key];
            
            if (prevValue !== currValue) {
              elemDiffs.changes.push({
                attribute: `attributes.${key}`,
                previous: prevValue,
                current: currValue
              });
            }
          });
          
          // Compare text content if it exists
          if ('text' in currentElem && 'text' in matchingPrevElement &&
              currentElem.text !== matchingPrevElement.text) {
            elemDiffs.changes.push({
              attribute: 'text',
              previous: matchingPrevElement.text,
              current: currentElem.text
            });
          }
          
          if (elemDiffs.changes.length > 0) {
            allDiffs.push(elemDiffs);
          }
        } else {
          // This is a new element
          allDiffs.push({
            type: category,
            element: currentElem,
            changes: [{
              attribute: 'element',
              previous: null,
              current: 'New element'
            }]
          });
        }
      });
      
      // Find elements that existed before but are now gone
      previousElements.forEach((prevElem: any) => {
        const stillExists = currentElements.some((currElem: any) => {
          return (
            (prevElem.xpath === currElem.xpath) ||
            (prevElem.css_selector === currElem.css_selector) ||
            (prevElem.attributes?.id && prevElem.attributes.id === currElem.attributes?.id)
          );
        });
        
        if (!stillExists) {
          allDiffs.push({
            type: category,
            element: prevElem,
            changes: [{
              attribute: 'element',
              previous: 'Removed element',
              current: null
            }]
          });
        }
      });
    });
    
    return allDiffs;
  };
  
  const getFilteredDifferences = () => {
    if (selectedCategory === 'all') return differences;
    return differences.filter(diff => diff.type === selectedCategory);
  };
  
  if (!currentData || !previousData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compare Elements</CardTitle>
          <CardDescription>
            Compare current page elements with previously stored elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {!currentData && !previousData 
                ? "Extract elements first to enable comparison"
                : !currentData 
                ? "Extract elements from the current page to compare" 
                : "No previous data available for comparison"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const filteredDifferences = getFilteredDifferences();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Element Changes</CardTitle>
        <CardDescription>
          Comparing current page elements with previously stored elements
        </CardDescription>
        
        <TabsList className="mt-4">
          <TabsTrigger 
            value="all"
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "bg-blue-100" : ""}
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="buttons"
            onClick={() => setSelectedCategory("buttons")}
            className={selectedCategory === "buttons" ? "bg-blue-100" : ""}
          >
            Buttons
          </TabsTrigger>
          <TabsTrigger 
            value="forms"
            onClick={() => setSelectedCategory("forms")}
            className={selectedCategory === "forms" ? "bg-blue-100" : ""}
          >
            Forms
          </TabsTrigger>
          <TabsTrigger 
            value="inputs"
            onClick={() => setSelectedCategory("inputs")}
            className={selectedCategory === "inputs" ? "bg-blue-100" : ""}
          >
            Inputs
          </TabsTrigger>
        </TabsList>
      </CardHeader>
      
      <CardContent>
        {filteredDifferences.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No differences found in the selected category
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {filteredDifferences.map((diff, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium">
                      {diff.element.text || diff.element.name || `${diff.type} element`}
                    </div>
                    <Badge>{diff.type}</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {diff.changes.map((change: any, i: number) => (
                      <div key={i} className="text-sm">
                        <div className="font-medium mb-1">{change.attribute}</div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Previous:</div>
                            <div className={`p-2 text-xs rounded ${change.previous === null ? 'bg-red-100 text-red-800' : 'bg-gray-100'} font-mono`}>
                              {change.previous === null ? 'N/A' : 
                               typeof change.previous === 'object' ? JSON.stringify(change.previous) : 
                               String(change.previous)}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Current:</div>
                            <div className={`p-2 text-xs rounded ${change.current === null ? 'bg-red-100 text-red-800' : 'bg-green-100'} font-mono`}>
                              {change.current === null ? 'N/A' : 
                               typeof change.current === 'object' ? JSON.stringify(change.current) : 
                               String(change.current)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ElementComparison;
