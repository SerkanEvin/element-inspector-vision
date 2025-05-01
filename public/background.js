
// Background script for Element Inspector Vision

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Element Inspector Vision Extension installed");
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getElementData") {
    // Retrieve any stored element data
    chrome.storage.local.get(['previousElementsData'], (result) => {
      sendResponse({ data: result.previousElementsData || null });
    });
    return true; // Required for async sendResponse
  }
});
