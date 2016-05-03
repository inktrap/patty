/*jshint esversion: 6 */

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.method == "getRules"){
        chrome.storage.local.get('rules', function(jsonResult){
            if (chrome.runtime.lastError){
                console.log(chrome.runtime.lastError);
            } else {
                sendResponse({rules: jsonResult.rules});
            }
        });
    }
    else {
      sendResponse({});
    }
    return true;
});

/* open a page*/
function openOptions(e) {
   //chrome.runtime.openOptionsPage();
   // in firefox 46 openOptionsPage() does not work.
   chrome.tabs.create({
     "url": chrome.extension.getURL("options/options.html")
   });
}
/* open the options page when the icon is clicked*/
chrome.browserAction.onClicked.addListener(openOptions);

