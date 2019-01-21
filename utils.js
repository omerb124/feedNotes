/**
 * Utilities file 
 */

/**
 * Injecting script to active tab via background script
 * @param {Object} injectDetails - object of inject details, like file or code to execute.
 */

var injectScript = (injectDetails) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            {
                type: "injectScript",
                data: {
                    injectDetails: injectDetails
                }
            }, function (response) {
                console.log("Response has been recieved:");
                console.log(response);
                if (response.status !== 200) {
                    reject("Error " + response.status + " during InjectScript() execution:" + response.message);
                }
                else {
                    resolve(response.data);
                }
            });
    });
}

/**
 * @param {Object} element - element to check events on
 * @return {Array}
 */
var getEvents = (element) => {
    var elemEvents = $._data(element, "events");
    var allDocEvnts = $._data(document, "events");
    for(var evntType in allDocEvnts) {
        if(allDocEvnts.hasOwnProperty(evntType)) {
            var evts = allDocEvnts[evntType];
            for(var i = 0; i < evts.length; i++) {
                if($(element).is(evts[i].selector)) {
                    if(elemEvents == null) {
                        elemEvents = {};
                    }
                    if(!elemEvents.hasOwnProperty(evntType)) {
                        elemEvents[evntType] = [];
                    }
                    elemEvents[evntType].push(evts[i]);
                }
            }
        }
    }
    return elemEvents;
}
