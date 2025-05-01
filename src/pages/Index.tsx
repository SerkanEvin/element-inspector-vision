
import { useState } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExtractTabContent from '@/components/ExtractTabContent';
import CompareTabContent from '@/components/CompareTabContent';
import { useElementExtraction } from '@/hooks/useElementExtraction';

const Index = () => {
  const { 
    elementsData, 
    previousData, 
    isExtracting, 
    handleExtractElements, 
    handleDownloadJson 
  } = useElementExtraction();
  
  const [activeTab, setActiveTab] = useState("extract");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-4 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="extract">Extract Elements</TabsTrigger>
            <TabsTrigger value="compare">Compare Changes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="extract" className="space-y-4">
            <ExtractTabContent
              elementsData={elementsData}
              isExtracting={isExtracting}
              onExtract={handleExtractElements}
              onDownloadJson={handleDownloadJson}
            />
          </TabsContent>
          
          <TabsContent value="compare" className="space-y-4">
            <CompareTabContent
              currentData={elementsData}
              previousData={previousData}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
