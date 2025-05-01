
/**
 * Function that will be injected into the page to extract elements
 */
export function extractPageElements() {
  const getXPath = (element: any) => {
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
  
  const getCssSelector = (element: any) => {
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
  
  const getAttributes = (element: any) => {
    const attributes: Record<string, string> = {};
    
    if (!element.attributes) return attributes;
    
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attributes[attr.name] = attr.value;
    }
    
    return attributes;
  };
  
  const extractElements = () => {
    const result: any = {
      buttons: [],
      forms: [],
      inputs: [],
      selects: [],
      links: [],
      others: []
    };
    
    // Extract buttons
    const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"]');
    buttons.forEach((button: Element) => {
      result.buttons.push({
        type: "button",
        text: button.textContent?.trim() || (button as HTMLInputElement).value || "",
        xpath: getXPath(button),
        css_selector: getCssSelector(button),
        attributes: getAttributes(button)
      });
    });
    
    // Extract forms
    const forms = document.querySelectorAll('form');
    forms.forEach((form: Element) => {
      result.forms.push({
        type: "form",
        xpath: getXPath(form),
        css_selector: getCssSelector(form),
        attributes: getAttributes(form)
      });
    });
    
    // Extract inputs
    const inputs = document.querySelectorAll('input:not([type="button"]):not([type="submit"]), textarea');
    inputs.forEach((input: Element) => {
      result.inputs.push({
        type: "input",
        name: (input as HTMLInputElement).name || "",
        xpath: getXPath(input),
        css_selector: getCssSelector(input),
        attributes: getAttributes(input)
      });
    });
    
    // Extract selects
    const selects = document.querySelectorAll('select');
    selects.forEach((select: Element) => {
      result.selects.push({
        type: "select",
        name: (select as HTMLSelectElement).name || "",
        xpath: getXPath(select),
        css_selector: getCssSelector(select),
        attributes: getAttributes(select),
        options: Array.from((select as HTMLSelectElement).options).map(option => ({
          value: option.value,
          text: option.text,
          selected: option.selected
        }))
      });
    });
    
    // Extract links
    const links = document.querySelectorAll('a');
    links.forEach((link: Element) => {
      result.links.push({
        type: "link",
        text: link.textContent?.trim() || "",
        href: (link as HTMLAnchorElement).href || "",
        xpath: getXPath(link),
        css_selector: getCssSelector(link),
        attributes: getAttributes(link)
      });
    });
    
    return result;
  };
  
  return extractElements();
}
