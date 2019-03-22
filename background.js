/**
 * Background Logic
 */
(function () {
    var bgscript = () => {
        var a = {};

        let messageListener = (request, sender, sendResponse) => {

            switch (request.type) {
                case 'clickBody':
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        console.log(tabs);
                        sendResponse({ good: true });
                    });
                    return true;
                    break;
                // Inject script to webpage
                case 'injectScript':
                    if (sender.tab && "injectDetails" in request.data) {
                        let tabid = sender.tab.id;
                        console.log(tabid);
                        let filePath = request.data.injectDetails.file || null;
                        if (filePath) {
                            chrome.tabs.executeScript(tabid, {file : filePath}, (data) => {
                                if (chrome.runtime.lastError) {
                                    // Chrome error
                                    responseData = {
                                        status: 500,
                                        message: chrome.runtime.lastError.message
                                    };

                                } else {
                                    // Success
                                    responseData = {
                                        status: 200,
                                        data: data
                                    };

                                }
                                sendResponse(responseData);
                            });
                        }

                        // Async response
                        return true;
                    }
                    else {
                        // Missing Parmeters
                        responseData = {
                            status: 422,
                            message: 'Missing parameters'
                        };
                        sendResponse(responseData);
                        return;
                    }
                    break;
                default:
                // Do Nothing
            }



        };

        a.init = () => {
            chrome.runtime.onMessage.addListener(messageListener);
            console.log("Background Initialized");
        }

        a.init();
    };

    chrome.runtime.onInstalled.addListener(() => {
        bgscript();
    });
})();