
// Type definitions for Chrome extension API
declare namespace chrome {
  namespace tabs {
    type Tab = {
      id?: number;
      url?: string;
      title?: string;
      active: boolean;
      windowId?: number;
    };

    function query(queryInfo: { active: boolean; currentWindow: boolean }, callback: (tabs: Tab[]) => void): void;
  }

  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | object | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: object, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
      clear(callback?: () => void): void;
    }

    const local: StorageArea;
    const sync: StorageArea;
  }

  namespace runtime {
    const id: string;
    
    function sendMessage(message: any, callback?: (response: any) => void): void;
    function onMessage: {
      addListener: (callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void) => void;
    };
    
    function onInstalled: {
      addListener: (callback: (details: any) => void) => void;
    };
  }

  namespace scripting {
    type ScriptInjection = {
      target: { tabId: number };
      function: (...args: any[]) => any;
    };

    function executeScript(injection: ScriptInjection, callback?: (results: { result: any }[]) => void): void;
  }
}
