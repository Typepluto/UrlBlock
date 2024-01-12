chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    const forbiddenKeywords = ["youtube", "netflix", "disney"];
    const isPageForbidden = forbiddenKeywords.some((keyword) =>
        tab.url.includes(keyword)
    );
    if (isPageForbidden) {
        
        chrome.tabs.remove(tabId);
    }
  });