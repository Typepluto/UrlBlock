
var startup_youtube_tabs_url;
const forbiddenKeywords = ["youtube", "netflix", "disney"];

const extractVideoId = (url) => {
    // Define a regular expression to match YouTube video URLs
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  
    // Use the regular expression to extract the video ID
    const match = url.match(regex);
  
    // Check if a match is found and return the video ID
    return match ? match[1] : null;
}


chrome.runtime.onStartup.addListener( async () => {
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
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    
    const isPageForbidden = forbiddenKeywords.some((keyword) =>
        tab.url.includes(keyword)
    )
    if(changeInfo.status == "loading" && isPageForbidden) {
        // console.log(changeInfo);
        if(!startup_youtube_tabs_url.includes(extractVideoId(tab.url))){
            // console.log("go back", tab);
            chrome.tabs.goBack(tabId);
            // chrome.tabs.remove(tabId);
        }
    }
});
