
import ElementComparison from '@/components/ElementComparison';

interface CompareTabContentProps {
  currentData: any | null;
  previousData: any | null;
}

const CompareTabContent = ({ 
  currentData, 
  previousData 
}: CompareTabContentProps) => {
  return (
    <div className="space-y-6">
      <ElementComparison 
        currentData={currentData} 
        previousData={previousData} 
      />
    </div>
  );
};

export default CompareTabContent;
