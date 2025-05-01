
import { Button } from "@/components/ui/button";
import ElementExtractor from '@/components/ElementExtractor';
import ElementList from '@/components/ElementList';

interface ExtractTabContentProps {
  elementsData: any | null;
  isExtracting: boolean;
  onExtract: () => void;
  onDownloadJson: () => void;
}

const ExtractTabContent = ({ 
  elementsData, 
  isExtracting, 
  onExtract, 
  onDownloadJson 
}: ExtractTabContentProps) => {
  return (
    <div className="space-y-4">
      <ElementExtractor 
        onExtract={onExtract} 
        isExtracting={isExtracting}
      />
      
      {elementsData && (
        <div className="space-y-4">
          <ElementList elementsData={elementsData} />
          
          <div className="flex justify-end">
            <Button onClick={onDownloadJson} className="bg-blue-600 hover:bg-blue-700">
              Download JSON
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtractTabContent;
