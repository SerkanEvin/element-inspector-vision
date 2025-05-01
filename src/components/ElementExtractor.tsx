
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ElementExtractorProps {
  onExtract: () => void;
  isExtracting: boolean;
}

const ElementExtractor = ({ onExtract, isExtracting }: ElementExtractorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Extract Elements</CardTitle>
        <CardDescription>
          Scan the current page to extract all interactive HTML elements and their selectors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          This will identify all buttons, forms, inputs, and other interactive elements on the page
          and extract their XPath, CSS selectors, and attributes.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onExtract} 
          disabled={isExtracting}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isExtracting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Extracting...
            </>
          ) : "Extract Elements"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ElementExtractor;
