
let startup_youtube_tabs_url;
const forbiddenKeywords = ["youtube", "netflix", "disney"];

const extractVideoId = (url) => {
    const regex = /watch\?v=(.{11})/;
  
    const match = url.match(regex);

    return match ? match[1] : null;
}

const addListeners = async () => {
    const tabs = await chrome.tabs.query({});

    startup_youtube_tabs_url = tabs.reduce(
        (acc, curr) => {
            if(curr.url.includes("youtube") && curr.url != "https://www.youtube.com/") {
                acc.push(extractVideoId(curr.url));
            }
            return acc;
        },
        []
    );

    console.log(startup_youtube_tabs_url);

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        
        const isPageForbidden = forbiddenKeywords.some((keyword) =>
            tab.url.includes(keyword)
        )
        if(changeInfo.status == "loading" && isPageForbidden) {
            if(startup_youtube_tabs_url.includes(extractVideoId(tab.url))){
                return null;
            }
            
            chrome.tabs.goBack(tabId)
            .catch((error) => {
                console.log(error);
                chrome.tabs.remove(tabId);
            });
        }
    });

    return null
}

addListeners();