
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ElementListProps {
  elementsData: {
    buttons?: any[];
    forms?: any[];
    inputs?: any[];
    selects?: any[];
    links?: any[];
    others?: any[];
  };
}

const ElementList = ({ elementsData }: ElementListProps) => {
  const [expandedElement, setExpandedElement] = useState<string | null>(null);
  
  const getTotalCount = () => {
    let count = 0;
    Object.values(elementsData).forEach(group => {
      count += group?.length || 0;
    });
    return count;
  };
  
  const handleElementClick = (elementId: string) => {
    setExpandedElement(expandedElement === elementId ? null : elementId);
  };
  
  const renderElementGroup = (groupName: string, elements: any[]) => {
    if (!elements || elements.length === 0) return null;
    
    return (
      <AccordionItem value={groupName} className="border rounded-md mb-4">
        <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
          <div className="flex items-center">
            <span className="text-lg font-medium">{groupName}</span>
            <Badge variant="outline" className="ml-2">{elements.length}</Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 py-3">
          <div className="space-y-3">
            {elements.map((element, index) => (
              <Card 
                key={`${groupName}-${index}`}
                className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleElementClick(`${groupName}-${index}`)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">
                    {element.text || element.name || `${element.type} ${index + 1}`}
                  </div>
                  <Badge>{element.type}</Badge>
                </div>
                
                {expandedElement === `${groupName}-${index}` && (
                  <div className="text-sm space-y-2 mt-3">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">XPath:</div>
                      <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                        {element.xpath}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">CSS Selector:</div>
                      <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                        {element.css_selector}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Attributes:</div>
                      <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                        {JSON.stringify(element.attributes, null, 2)}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Extracted Elements</h2>
        <Badge variant="outline">{getTotalCount()} total</Badge>
      </div>
      
      <Accordion type="multiple" defaultValue={["buttons"]}>
        {renderElementGroup("Buttons", elementsData.buttons || [])}
        {renderElementGroup("Forms", elementsData.forms || [])}
        {renderElementGroup("Inputs", elementsData.inputs || [])}
        {renderElementGroup("Selects", elementsData.selects || [])}
        {renderElementGroup("Links", elementsData.links || [])}
        {renderElementGroup("Others", elementsData.others || [])}
      </Accordion>
    </div>
  );
};

export default ElementList;
