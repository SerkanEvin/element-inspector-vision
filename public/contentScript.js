
// Content script that runs on the webpage
// This will be injected by the extension

console.log("Element Inspector Vision content script running");

// We'll use the main script in Index.tsx for the actual element extraction
// This is just a placeholder for any additional functionality needed directly in the page context

// Listen for mutations to detect dynamically added elements
const setupMutationObserver = () => {
  const targetNode = document.body;
  
  // Options for the observer (which mutations to observe)
  const config = { 
    attributes: true, 
    childList: true, 
    subtree: true 
  };
  
  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    // We could send a message back to the extension that the DOM has changed
    chrome.runtime.sendMessage({ 
      action: "domChanged",
      timestamp: new Date().toISOString()
    });
  };
  
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);
  
  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
};

// Run after the page is fully loaded
if (document.readyState === 'complete') {
  setupMutationObserver();
} else {
  window.addEventListener('load', setupMutationObserver);
}
